package handler

import (
	"context"
	"errors"
	"time"

	sandboxv1 "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/pb/sandbox/v1"
	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runner"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type RunnerHandler struct {
	sandboxv1.UnimplementedRunnerServiceServer
	mgr *runner.Manager
}

func NewRunnerHandler(mgr *runner.Manager) *RunnerHandler {
	return &RunnerHandler{mgr: mgr}
}

func (h *RunnerHandler) RunCode(ctx context.Context, req *sandboxv1.RunCodeRequest) (*sandboxv1.RunCodeResponse, error) {
	if req.Code == "" {
		return nil, status.Error(codes.InvalidArgument, "code is required")
	}
	if req.Language == "" {
		return nil, status.Error(codes.InvalidArgument, "language is required")
	}

	timeout := time.Duration(req.TimeoutSeconds) * time.Second
	if timeout <= 0 {
		timeout = 0 // use default from LangConfig
	}

	result, err := h.mgr.Run(ctx, runner.RunRequest{
		Language: req.Language,
		Code:     req.Code,
		Stdin:    req.Stdin,
		Timeout:  timeout,
	})
	if err != nil {
		if errors.Is(err, runner.ErrUnsupportedLanguage) {
			return nil, status.Errorf(codes.InvalidArgument, "unsupported language: %s", req.Language)
		}
		if errors.Is(err, runner.ErrTimeout) {
			return &sandboxv1.RunCodeResponse{
				Stderr:   "execution timed out",
				ExitCode: -1,
				Error:    "timeout",
			}, nil
		}
		return &sandboxv1.RunCodeResponse{
			ExitCode: -1,
			Error:    err.Error(),
		}, nil
	}

	return &sandboxv1.RunCodeResponse{
		Stdout:      result.Stdout,
		Stderr:      result.Stderr,
		ExitCode:    int32(result.ExitCode),
		ExecutionMs: result.ExecutionMs,
	}, nil
}
