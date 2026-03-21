package sandbox

import (
	"net/http"

	sandboxRPC "github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/rpc/sandbox"
	"github.com/gin-gonic/gin"
)

type runCodeRequest struct {
	Language       string `json:"language" binding:"required"`
	Code           string `json:"code" binding:"required"`
	Stdin          string `json:"stdin"`
	TimeoutSeconds int32  `json:"timeout_seconds"`
	WorkspaceKey   string `json:"workspace_key"`
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

	resp, err := sandboxRPC.RunCode(
		c.Request.Context(),
		req.Language,
		req.Code,
		req.Stdin,
		req.TimeoutSeconds,
		currentUserID(c),
		req.WorkspaceKey,
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
