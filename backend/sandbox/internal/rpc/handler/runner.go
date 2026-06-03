package handler

import (
	"context"
	"errors"
	"strconv"
	"strings"
	"time"

	sandboxv1 "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/pb/sandbox/v1"
	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runner"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

const (
	runnerOwnerIDMetadataKey      = "x-sandbox-owner-id"
	runnerWorkspaceKeyMetadataKey = "x-sandbox-workspace-key"
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

	ownerID, workspaceKey := runnerScopeFromContext(ctx)
	files := make(map[string]string, len(req.Files))
	for _, file := range req.Files {
		files[file.Path] = file.Content
	}

	result, err := h.mgr.Run(ctx, runner.RunRequest{
		OwnerID:      ownerID,
		WorkspaceKey: workspaceKey,
		Language:     req.Language,
		Code:         req.Code,
		Stdin:        req.Stdin,
		Files:        files,
		Timeout:      timeout,
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

func runnerScopeFromContext(ctx context.Context) (uint64, string) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return 0, ""
	}

	var ownerID uint64
	if values := md.Get(runnerOwnerIDMetadataKey); len(values) > 0 {
		parsed, err := strconv.ParseUint(values[0], 10, 64)
		if err == nil {
			ownerID = parsed
		}
	}

	var workspaceKey string
	if values := md.Get(runnerWorkspaceKeyMetadataKey); len(values) > 0 {
		workspaceKey = strings.TrimSpace(values[0])
	}

	return ownerID, workspaceKey
}
