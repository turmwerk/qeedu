package sandbox

import (
	"net/http"

	"github.com/gin-gonic/gin"
	sandboxRPC "github.com/turmwerk/qeedu/backend/gateway/internal/rpc/sandbox"
	sandboxv1 "github.com/turmwerk/qeedu/backend/pkg/pb/sandbox/v1"
)

type runFileRequest struct {
	Path    string `json:"path"`
	Content string `json:"content"`
}

type runCodeRequest struct {
	Language       string           `json:"language" binding:"required"`
	Code           string           `json:"code" binding:"required"`
	Stdin          string           `json:"stdin"`
	TimeoutSeconds int32            `json:"timeout_seconds"`
	WorkspaceKey   string           `json:"workspace_key"`
	Files          []runFileRequest `json:"files"`
}

// RunCode handles POST /api/v1/sandbox/run
func RunCode(c *gin.Context) {
	var req runCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.TimeoutSeconds <= 0 {
		req.TimeoutSeconds = 10
	}

	files := make([]*sandboxv1.RunFile, 0, len(req.Files))
	for _, file := range req.Files {
		files = append(files, &sandboxv1.RunFile{
			Path:    file.Path,
			Content: file.Content,
		})
	}

	resp, err := sandboxRPC.RunCode(
		c.Request.Context(),
		req.Language,
		req.Code,
		req.Stdin,
		req.TimeoutSeconds,
		currentUserID(c),
		req.WorkspaceKey,
		files,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"stdout":       resp.Stdout,
		"stderr":       resp.Stderr,
		"exit_code":    resp.ExitCode,
		"execution_ms": resp.ExecutionMs,
		"error":        resp.Error,
	})
}
