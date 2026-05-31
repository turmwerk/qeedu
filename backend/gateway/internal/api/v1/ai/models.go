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
	{ID: "google/gemma-4-26b-a4b-it:free", Name: "Gemma 4 26B A4B (快)", Provider: "Google"},
	{ID: "google/gemma-4-31b-it:free", Name: "Gemma 4 31B", Provider: "Google"},
	{ID: "deepseek/deepseek-v4-flash:free", Name: "DeepSeek V4 Flash", Provider: "DeepSeek"},
	{ID: "moonshotai/kimi-k2.6:free", Name: "Kimi K2.6", Provider: "MoonshotAI"},
	{ID: "qwen/qwen3-coder:free", Name: "Qwen3 Coder 480B", Provider: "Qwen"},
	{ID: "openai/gpt-oss-120b:free", Name: "GPT-OSS 120B", Provider: "OpenAI"},
	{ID: "nvidia/nemotron-3-super-120b-a12b:free", Name: "Nemotron 3 Super", Provider: "NVIDIA"},
	{ID: "meta-llama/llama-3.3-70b-instruct:free", Name: "Llama 3.3 70B", Provider: "Meta"},
	{ID: "openrouter/owl-alpha", Name: "Owl Alpha 1.7T", Provider: "OpenRouter"},
	{ID: "z-ai/glm-4.5-air:free", Name: "GLM 4.5 Air", Provider: "Z.ai"},
}

// currentChatModel returns the active chat model ID (env-overridable).
func currentChatModel() string {
	if m := os.Getenv("LLM_CHAT_MODEL"); m != "" {
		return strings.TrimSpace(m)
	}
	return "google/gemma-4-31b-it:free"
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
