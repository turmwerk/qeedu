package ai

import (
	"fmt"
	"io"
	"net/http"

	aichatv1 "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/pb/ai-chat/v1"
	aiChatRPC "github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/rpc/ai-chat"
	"github.com/gin-gonic/gin"
)

type fixBugReqBody struct {
	Code         string `json:"code"`
	ErrorMessage string `json:"error_message"`
	Language     string `json:"language"`
}

// FixBug handles POST /api/v1/ai/fix with SSE streaming.
func FixBug(c *gin.Context) {
	var body fixBugReqBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	req := &aichatv1.FixBugRequest{
		Code:         body.Code,
		ErrorMessage: body.ErrorMessage,
		Language:     body.Language,
	}

	dataCh, errCh := aiChatRPC.FixBugStream(c.Request.Context(), req)

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
