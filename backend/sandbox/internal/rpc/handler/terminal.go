package handler

import (
	"context"
	"io"
	"time"

	sandboxv1 "github.com/dieWehmut/nju-edu-ai-system/backend/proto/sandbox/v1"
	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/terminal"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type TerminalHandler struct {
	sandboxv1.UnimplementedTerminalServiceServer
	mgr *terminal.Manager
}

func NewTerminalHandler(mgr *terminal.Manager) *TerminalHandler {
	return &TerminalHandler{mgr: mgr}
}

func (h *TerminalHandler) ExecuteCommand(ctx context.Context, req *sandboxv1.ExecuteCommandRequest) (*sandboxv1.ExecuteCommandResponse, error) {
	if req.Command == "" {
		return nil, status.Error(codes.InvalidArgument, "command is required")
	}

	timeout := time.Duration(req.TimeoutSeconds) * time.Second

	stdout, stderr, exitCode, err := h.mgr.ExecuteCommand(ctx, req.Command, req.Shell, req.WorkingDir, timeout)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "execute command: %v", err)
	}

	return &sandboxv1.ExecuteCommandResponse{
		Stdout:   stdout,
		Stderr:   stderr,
		ExitCode: int32(exitCode),
	}, nil
}

func (h *TerminalHandler) CreateSession(ctx context.Context, req *sandboxv1.CreateSessionRequest) (*sandboxv1.CreateSessionResponse, error) {
	sess, err := h.mgr.CreateSession(ctx, req.Shell, req.Cols, req.Rows)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "create session: %v", err)
	}
	return &sandboxv1.CreateSessionResponse{SessionId: sess.ID}, nil
}

func (h *TerminalHandler) DestroySession(ctx context.Context, req *sandboxv1.DestroySessionRequest) (*sandboxv1.DestroySessionResponse, error) {
	if err := h.mgr.DestroySession(ctx, req.SessionId); err != nil {
		return nil, status.Errorf(codes.Internal, "destroy session: %v", err)
	}
	return &sandboxv1.DestroySessionResponse{}, nil
}

func (h *TerminalHandler) InteractiveSession(stream sandboxv1.TerminalService_InteractiveSessionServer) error {
	// Read the first message to get session_id
	first, err := stream.Recv()
	if err != nil {
		return status.Errorf(codes.InvalidArgument, "failed to receive first message: %v", err)
	}

	sess, ok := h.mgr.GetSession(first.SessionId)
	if !ok {
		return status.Errorf(codes.NotFound, "session %s not found", first.SessionId)
	}

	// If the first message has data, write it to the PTY
	if len(first.Data) > 0 {
		if _, err := sess.Write(first.Data); err != nil {
			return status.Errorf(codes.Internal, "write to session: %v", err)
		}
	}

	ctx := stream.Context()
	errCh := make(chan error, 2)

	// Goroutine: read from PTY -> send to client
	go func() {
		buf := make([]byte, 4096)
		for {
			n, readErr := sess.Read(buf)
			if n > 0 {
				sendErr := stream.Send(&sandboxv1.TerminalOutput{
					SessionId: sess.ID,
					Data:      buf[:n],
				})
				if sendErr != nil {
					errCh <- sendErr
					return
				}
			}
			if readErr != nil {
				if readErr == io.EOF {
					_ = stream.Send(&sandboxv1.TerminalOutput{
						SessionId: sess.ID,
						Closed:    true,
					})
				}
				errCh <- readErr
				return
			}
		}
	}()

	// Goroutine: read from client -> write to PTY
	go func() {
		for {
			msg, recvErr := stream.Recv()
			if recvErr != nil {
				errCh <- recvErr
				return
			}

			if msg.Resize != nil {
				_ = h.mgr.Resize(ctx, sess.ID, uint(msg.Resize.Cols), uint(msg.Resize.Rows))
			}

			if len(msg.Data) > 0 {
				if _, writeErr := sess.Write(msg.Data); writeErr != nil {
					errCh <- writeErr
					return
				}
			}
		}
	}()

	// Wait for context cancellation or error
	select {
	case <-ctx.Done():
		return ctx.Err()
	case err := <-errCh:
		if err == io.EOF {
			return nil
		}
		return err
	}
}
