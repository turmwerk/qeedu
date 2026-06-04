package sandbox

import (
	"net/http"

	"github.com/gin-gonic/gin"
	sandboxRPC "github.com/turmwerk/qeedu/backend/gateway/internal/rpc/sandbox"
)

type execCommandRequest struct {
	Command        string `json:"command" binding:"required"`
	Shell          string `json:"shell"`
	WorkingDir     string `json:"working_dir"`
	TimeoutSeconds int32  `json:"timeout_seconds"`
}

// ExecCommand handles POST /api/v1/sandbox/exec
func ExecCommand(c *gin.Context) {
	var req execCommandRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.TimeoutSeconds <= 0 {
		req.TimeoutSeconds = 30
	}
	if req.Shell == "" {
		req.Shell = "bash"
	}

	resp, err := sandboxRPC.ExecuteCommand(c.Request.Context(), req.Command, req.Shell, req.WorkingDir, req.TimeoutSeconds)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"stdout":    resp.Stdout,
		"stderr":    resp.Stderr,
		"exit_code": resp.ExitCode,
	})
}
