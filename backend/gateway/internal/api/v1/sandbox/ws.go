package sandbox

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	sandboxRPC "github.com/turmwerk/qeedu/backend/gateway/internal/rpc/sandbox"
	sandboxv1 "github.com/turmwerk/qeedu/backend/pkg/pb/sandbox/v1"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  4096,
	WriteBufferSize: 4096,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type resizeMsg struct {
	Type string `json:"type"`
	Cols int32  `json:"cols"`
	Rows int32  `json:"rows"`
}

// TerminalWS handles GET /api/v1/sandbox/terminal/ws
// Upgrades to WebSocket, then bridges xterm <-> gRPC bidirectional stream.
func TerminalWS(c *gin.Context) {
	shell := c.DefaultQuery("shell", "bash")
	cols := int32(80)
	rows := int32(24)

	// Create a backend terminal session via gRPC
	createCtx, createCancel := context.WithTimeout(c.Request.Context(), 8*time.Second)
	defer createCancel()

	sessionID, err := sandboxRPC.CreateSession(createCtx, shell, cols, rows)
	if err != nil {
		log.Printf("[ws] create session: %v", err)
		statusCode := http.StatusInternalServerError
		if errors.Is(createCtx.Err(), context.DeadlineExceeded) {
			statusCode = http.StatusGatewayTimeout
		}
		c.JSON(statusCode, gin.H{"error": "failed to create session"})
		return
	}

	// Open bidi gRPC stream
	streamCtx, streamCancel := context.WithTimeout(c.Request.Context(), 8*time.Second)
	defer streamCancel()

	grpcStream, err := sandboxRPC.OpenInteractiveSession(streamCtx)
	if err != nil {
		log.Printf("[ws] open grpc stream: %v", err)
		_ = sandboxRPC.DestroySession(c.Request.Context(), sessionID)
		statusCode := http.StatusInternalServerError
		if errors.Is(streamCtx.Err(), context.DeadlineExceeded) {
			statusCode = http.StatusGatewayTimeout
		}
		c.JSON(statusCode, gin.H{"error": "failed to open stream"})
		return
	}

	// Upgrade HTTP -> WebSocket
	wsConn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("[ws] upgrade: %v", err)
		_ = grpcStream.CloseSend()
		_ = sandboxRPC.DestroySession(c.Request.Context(), sessionID)
		return
	}

	var once sync.Once
	cleanup := func() {
		once.Do(func() {
			_ = wsConn.Close()
			_ = grpcStream.CloseSend()
			_ = sandboxRPC.DestroySession(c.Request.Context(), sessionID)
		})
	}
	defer cleanup()

	// Send initial message with session_id to the gRPC stream
	if err := grpcStream.Send(&sandboxv1.TerminalInput{
		SessionId: sessionID,
	}); err != nil {
		log.Printf("[ws] initial send: %v", err)
		return
	}

	done := make(chan struct{})

	// gRPC stream -> WebSocket (PTY output to browser)
	go func() {
		defer close(done)
		for {
			out, err := grpcStream.Recv()
			if err != nil {
				if err != io.EOF {
					log.Printf("[ws] grpc recv: %v", err)
				}
				return
			}
			if out.Closed {
				_ = wsConn.WriteMessage(websocket.CloseMessage,
					websocket.FormatCloseMessage(websocket.CloseNormalClosure, "session closed"))
				return
			}
			if len(out.Data) > 0 {
				_ = wsConn.SetWriteDeadline(time.Now().Add(10 * time.Second))
				if err := wsConn.WriteMessage(websocket.BinaryMessage, out.Data); err != nil {
					return
				}
			}
		}
	}()

	// WebSocket -> gRPC stream (browser input to PTY)
	go func() {
		for {
			msgType, data, err := wsConn.ReadMessage()
			if err != nil {
				cleanup()
				return
			}

			if msgType == websocket.TextMessage {
				// Try to parse as resize control message
				var rm resizeMsg
				if json.Unmarshal(data, &rm) == nil && rm.Type == "resize" {
					_ = grpcStream.Send(&sandboxv1.TerminalInput{
						SessionId: sessionID,
						Resize:    &sandboxv1.ResizeEvent{Cols: rm.Cols, Rows: rm.Rows},
					})
					continue
				}
			}

			// Regular data (keyboard input)
			if err := grpcStream.Send(&sandboxv1.TerminalInput{
				SessionId: sessionID,
				Data:      data,
			}); err != nil {
				return
			}
		}
	}()

	<-done
}
