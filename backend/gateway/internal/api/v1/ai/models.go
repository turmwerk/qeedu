package ai

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

type ModelInfo struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Provider string `json:"provider"`
}

var availableModels = []ModelInfo{
	{ID: "deepseek-v4-flash", Name: "deepseek-v4-flash", Provider: "DeepSeek"},
	{ID: "liquid/lfm-2.5-1.2b-instruct:free", Name: "LFM2.5 1.2B Instruct (free)", Provider: "OpenRouter"},
}

// currentChatModel returns the active chat model ID (env-overridable).
func currentChatModel() string {
	if m := os.Getenv("LLM_CHAT_MODEL"); m != "" {
		return strings.TrimSpace(m)
	}
	return "deepseek-v4-flash"
}

// currentFixModel returns the active fixbug model ID.
func currentFixModel() string {
	if m := os.Getenv("LLM_FIX_MODEL"); m != "" {
		return strings.TrimSpace(m)
	}
	return currentChatModel()
}

// currentCopilotModel returns the active copilot model ID.
func currentCopilotModel() string {
	if m := os.Getenv("LLM_COPILOT_MODEL"); m != "" {
		return strings.TrimSpace(m)
	}
	return currentChatModel()
}

// ModelLabel returns a human-readable label for a model ID.
func ModelLabel(modelID string) string {
	for _, m := range availableModels {
		if m.ID == modelID {
			return m.Name
		}
	}
	return modelID
}

// ListModels handles GET /api/v1/ai/models — returns available models + current selection.
func ListModels(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"models": availableModels,
		"current": gin.H{
			"chat":    currentChatModel(),
			"fix":     currentFixModel(),
			"copilot": currentCopilotModel(),
		},
	})
}
