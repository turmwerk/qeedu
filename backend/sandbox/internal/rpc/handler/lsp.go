package handler

import (
	"context"
	"errors"
	"time"

	sandboxv1 "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/pb/sandbox/v1"
	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/lsp"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type LSPHandler struct {
	sandboxv1.UnimplementedLSPServiceServer
	mgr *lsp.Manager
}

func NewLSPHandler(mgr *lsp.Manager) *LSPHandler {
	return &LSPHandler{mgr: mgr}
}

func (h *LSPHandler) EnsureSession(
	ctx context.Context,
	req *sandboxv1.EnsureSessionRequest,
) (*sandboxv1.EnsureSessionResponse, error) {
	if req.GetWorkspaceKey() == "" {
		return nil, status.Error(codes.InvalidArgument, "workspace_key is required")
	}
	if req.GetLanguageGroup() == "" {
		return nil, status.Error(codes.InvalidArgument, "language_group is required")
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, 20*time.Second)
	defer cancel()

	sess, err := h.mgr.EnsureSession(timeoutCtx, req.GetOwnerId(), req.GetWorkspaceKey(), req.GetLanguageGroup(), req.GetFiles())
	if err != nil {
		if errors.Is(err, lsp.ErrUnsupportedLanguage) {
			return nil, status.Error(codes.InvalidArgument, err.Error())
		}
		return nil, status.Errorf(codes.Internal, "ensure lsp session: %v", err)
	}

	return &sandboxv1.EnsureSessionResponse{SessionId: sess.ID}, nil
}

func (h *LSPHandler) SyncFile(ctx context.Context, req *sandboxv1.SyncFileRequest) (*sandboxv1.SyncFileResponse, error) {
	if req.GetSessionId() == "" {
		return nil, status.Error(codes.InvalidArgument, "session_id is required")
	}
	if req.GetFilePath() == "" {
		return nil, status.Error(codes.InvalidArgument, "file_path is required")
	}

	timeoutCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	if err := h.mgr.SyncFile(timeoutCtx, req.GetSessionId(), req.GetFilePath(), req.GetContent(), req.GetVersion()); err != nil {
		if errors.Is(err, lsp.ErrSessionNotFound) {
			return nil, status.Error(codes.NotFound, err.Error())
		}
		if errors.Is(err, lsp.ErrUnsupportedLanguage) {
			return nil, status.Error(codes.InvalidArgument, err.Error())
		}
		return nil, status.Errorf(codes.Internal, "sync lsp file: %v", err)
	}
	return &sandboxv1.SyncFileResponse{}, nil
}

func (h *LSPHandler) GetDiagnostics(
	ctx context.Context,
	req *sandboxv1.GetDiagnosticsRequest,
) (*sandboxv1.GetDiagnosticsResponse, error) {
	records, err := h.mgr.GetDiagnostics(req.GetSessionId())
	if err != nil {
		if errors.Is(err, lsp.ErrSessionNotFound) {
			return nil, status.Error(codes.NotFound, err.Error())
		}
		return nil, status.Errorf(codes.Internal, "get diagnostics: %v", err)
	}

	diagnostics := make([]*sandboxv1.Diagnostic, 0, len(records))
	for _, record := range records {
		diagnostics = append(diagnostics, &sandboxv1.Diagnostic{
			FilePath:    record.FilePath,
			StartLine:   record.StartLine,
			StartColumn: record.StartColumn,
			EndLine:     record.EndLine,
			EndColumn:   record.EndColumn,
			Severity:    record.Severity,
			Source:      record.Source,
			Message:     record.Message,
			Code:        record.Code,
		})
	}

	return &sandboxv1.GetDiagnosticsResponse{Diagnostics: diagnostics}, nil
}

func (h *LSPHandler) GetCompletions(
	ctx context.Context,
	req *sandboxv1.GetCompletionsRequest,
) (*sandboxv1.GetCompletionsResponse, error) {
	timeoutCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	records, err := h.mgr.GetCompletions(
		timeoutCtx,
		req.GetSessionId(),
		req.GetFilePath(),
		req.GetVersion(),
		req.GetLine(),
		req.GetColumn(),
	)
	if err != nil {
		if errors.Is(err, lsp.ErrSessionNotFound) {
			return nil, status.Error(codes.NotFound, err.Error())
		}
		return nil, status.Errorf(codes.Internal, "get completions: %v", err)
	}

	items := make([]*sandboxv1.CompletionItem, 0, len(records))
	for _, record := range records {
		items = append(items, &sandboxv1.CompletionItem{
			Label:         record.Label,
			InsertText:    record.InsertText,
			Detail:        record.Detail,
			Documentation: record.Documentation,
			Kind:          record.Kind,
		})
	}

	return &sandboxv1.GetCompletionsResponse{Items: items}, nil
}

func (h *LSPHandler) DestroySession(
	ctx context.Context,
	req *sandboxv1.DestroyLSPSessionRequest,
) (*sandboxv1.DestroyLSPSessionResponse, error) {
	if err := h.mgr.DestroySession(ctx, req.GetSessionId()); err != nil {
		return nil, status.Errorf(codes.Internal, "destroy lsp session: %v", err)
	}
	return &sandboxv1.DestroyLSPSessionResponse{}, nil
}
