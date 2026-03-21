package sandbox

import (
	"net/http"

	sandboxRPC "github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/rpc/sandbox"
	sandboxv1 "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/pb/sandbox/v1"
	"github.com/gin-gonic/gin"
)

type workspaceFilePayload struct {
	Path     string `json:"path" binding:"required"`
	Content  string `json:"content"`
	Language string `json:"language"`
}

type ensureSessionRequest struct {
	WorkspaceKey  string                 `json:"workspace_key" binding:"required"`
	LanguageGroup string                 `json:"language_group" binding:"required"`
	Files         []workspaceFilePayload `json:"files"`
}

type syncFileRequest struct {
	FilePath string `json:"file_path" binding:"required"`
	Content  string `json:"content"`
	Version  int32  `json:"version"`
}

type completionRequest struct {
	FilePath string `json:"file_path" binding:"required"`
	Line     int32  `json:"line" binding:"required"`
	Column   int32  `json:"column" binding:"required"`
	Version  int32  `json:"version"`
}

func EnsureLSPSession(c *gin.Context) {
	var body ensureSessionRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	files := make([]*sandboxv1.WorkspaceFile, 0, len(body.Files))
	for _, file := range body.Files {
		files = append(files, &sandboxv1.WorkspaceFile{
			Path:     file.Path,
			Content:  file.Content,
			Language: file.Language,
		})
	}

	resp, err := sandboxRPC.EnsureLSPSession(c.Request.Context(), &sandboxv1.EnsureSessionRequest{
		OwnerId:       currentUserID(c),
		WorkspaceKey:  body.WorkspaceKey,
		LanguageGroup: body.LanguageGroup,
		Files:         files,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"session_id": resp.GetSessionId()})
}

func SyncLSPFile(c *gin.Context) {
	var body syncFileRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := sandboxRPC.SyncLSPFile(c.Request.Context(), &sandboxv1.SyncFileRequest{
		SessionId: c.Param("sessionId"),
		FilePath:  body.FilePath,
		Content:   body.Content,
		Version:   body.Version,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func GetLSPDiagnostics(c *gin.Context) {
	resp, err := sandboxRPC.GetLSPDiagnostics(c.Request.Context(), &sandboxv1.GetDiagnosticsRequest{
		SessionId: c.Param("sessionId"),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"diagnostics": resp.GetDiagnostics()})
}

func GetLSPCompletions(c *gin.Context) {
	var body completionRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := sandboxRPC.GetLSPCompletions(c.Request.Context(), &sandboxv1.GetCompletionsRequest{
		SessionId: c.Param("sessionId"),
		FilePath:  body.FilePath,
		Line:      body.Line,
		Column:    body.Column,
		Version:   body.Version,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": resp.GetItems()})
}

func DestroyLSPSession(c *gin.Context) {
	if err := sandboxRPC.DestroyLSPSession(c.Request.Context(), c.Param("sessionId")); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func currentUserID(c *gin.Context) uint64 {
	raw, ok := c.Get("user_id")
	if !ok {
		return 0
	}
	switch value := raw.(type) {
	case uint:
		return uint64(value)
	case uint64:
		return value
	case int:
		if value > 0 {
			return uint64(value)
		}
	}
	return 0
}
