package ai

import (
	"fmt"
	"io"
	"net/http"

	aichatv1 "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/pb/ai-chat/v1"
	aiChatRPC "github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/rpc/ai-chat"
	"github.com/gin-gonic/gin"
)

type chatReqBody struct {
	Messages    []chatMsg `json:"messages"`
	FileContext string    `json:"file_context"`
	Language    string    `json:"language"`
}

type chatMsg struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// Chat handles POST /api/v1/ai/chat with SSE streaming.
func Chat(c *gin.Context) {
	var body chatReqBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	msgs := make([]*aichatv1.ChatMessage, len(body.Messages))
	for i, m := range body.Messages {
		msgs[i] = &aichatv1.ChatMessage{Role: m.Role, Content: m.Content}
	}

	req := &aichatv1.ChatRequest{
		Messages:    msgs,
		FileContext: body.FileContext,
		Language:    body.Language,
	}

	dataCh, errCh := aiChatRPC.ChatStream(c.Request.Context(), req)

	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	c.Header("X-Accel-Buffering", "no")

	c.Stream(func(w io.Writer) bool {
		select {
		case resp, ok := <-dataCh:
			if !ok {
				fmt.Fprintf(w, "data: [DONE]\n\n")
				return false
			}
			fmt.Fprintf(w, "data: %s\n\n", resp.Delta)
			return true
		case err, ok := <-errCh:
			if ok && err != nil {
				fmt.Fprintf(w, "data: [ERROR] %s\n\n", err.Error())
			}
			return false
		}
	})
}
