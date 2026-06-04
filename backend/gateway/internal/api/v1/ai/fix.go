package ai

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	aiChatRPC "github.com/turmwerk/qeedu/backend/gateway/internal/rpc/ai-chat"
	aichatv1 "github.com/turmwerk/qeedu/backend/pkg/pb/ai-chat/v1"
)

type fixBugReqBody struct {
	Code         string  `json:"code"`
	ErrorMessage string  `json:"error_message"`
	Language     string  `json:"language"`
	Model        string  `json:"model"`
	APIKey       string  `json:"api_key"`
	BaseURL      string  `json:"base_url"`
	Temperature  float64 `json:"temperature"`
	MaxTokens    int32   `json:"max_tokens"`
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
		Temperature:  body.Temperature,
		MaxTokens:    body.MaxTokens,
	}

	model := body.Model
	if model == "" {
		model = currentFixModel()
	}

	dataCh, errCh := aiChatRPC.FixBugStream(c.Request.Context(), req, model, body.APIKey, body.BaseURL)

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
