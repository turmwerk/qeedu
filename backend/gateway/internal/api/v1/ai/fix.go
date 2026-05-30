package ai

import (
	"io"
	"net/http"

	aiChatRPC "github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/rpc/ai-chat"
	aichatv1 "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/pb/ai-chat/v1"
	"github.com/gin-gonic/gin"
)

type fixBugReqBody struct {
	Code         string `json:"code"`
	ErrorMessage string `json:"error_message"`
	Language     string `json:"language"`
	Model        string `json:"model"`
	APIKey       string `json:"api_key"`
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

	model := body.Model
	if model == "" {
		model = currentFixModel()
	}

	dataCh, errCh := aiChatRPC.FixBugStream(c.Request.Context(), req, model, body.APIKey)

	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	c.Header("X-Accel-Buffering", "no")

	c.Stream(func(w io.Writer) bool {
		select {
		case resp, ok := <-dataCh:
			if !ok {
				writeSSEDone(w)
				return false
			}
			if resp.Done {
				if resp.Delta != "" {
					writeSSEPayload(w, gin.H{"delta": resp.Delta})
				}
				writeSSEDone(w)
				return false
			}
			if resp.Delta != "" {
				writeSSEPayload(w, gin.H{"delta": resp.Delta})
			}
			return true
		case err, ok := <-errCh:
			if ok && err != nil {
				writeSSEError(w, err)
			}
			return false
		}
	})
}
