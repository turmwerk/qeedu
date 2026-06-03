package ai

import (
	"net/http"

	aiCopilotRPC "github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/rpc/ai-copilot"
	aicopilotv1 "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/pb/ai-copilot/v1"
	"github.com/gin-gonic/gin"
)

type completeReqBody struct {
	Language     string  `json:"language"`
	FileContent  string  `json:"file_content"`
	CursorOffset int32   `json:"cursor_offset"`
	FilePath     string  `json:"file_path"`
	Model        string  `json:"model"`
	APIKey       string  `json:"api_key"`
	BaseURL      string  `json:"base_url"`
	Temperature  float64 `json:"temperature"`
	MaxTokens    int32   `json:"max_tokens"`
}

// Complete handles POST /api/v1/ai/complete.
func Complete(c *gin.Context) {
	var body completeReqBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	model := body.Model
	if model == "" {
		model = currentCopilotModel()
	}

	resp, err := aiCopilotRPC.Complete(c.Request.Context(), &aicopilotv1.CompleteRequest{
		Language:     body.Language,
		FileContent:  body.FileContent,
		CursorOffset: body.CursorOffset,
		FilePath:     body.FilePath,
		Model:        model,
		ApiKey:       body.APIKey,
		BaseUrl:      body.BaseURL,
		Temperature:  body.Temperature,
		MaxTokens:    body.MaxTokens,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"suggestion": resp.Suggestion})
}
