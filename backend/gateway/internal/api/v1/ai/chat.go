package ai

import (
	"io"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	aiChatRPC "github.com/turmwerk/qeedu/backend/gateway/internal/rpc/ai-chat"
	aichatv1 "github.com/turmwerk/qeedu/backend/pkg/pb/ai-chat/v1"
)

type chatReqBody struct {
	Messages    []chatMsg `json:"messages"`
	FileContext string    `json:"file_context"`
	Language    string    `json:"language"`
	Mode        string    `json:"mode"`
	Model       string    `json:"model"`
	APIKey      string    `json:"api_key"`
	BaseURL     string    `json:"base_url"`
	Temperature float64   `json:"temperature"`
	MaxTokens   int32     `json:"max_tokens"`
}

type chatMsg struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

func normalizeChatMode(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "agent", "plan":
		return strings.ToLower(strings.TrimSpace(value))
	default:
		return "ask"
	}
}

func chatModeInstruction(mode string) string {
	switch mode {
	case "agent":
		return "Chat mode: agent. Work autonomously toward the user's goal, use the provided context, make practical decisions when safe, and ask only when required information is missing."
	case "plan":
		return "Chat mode: plan. Produce a clear, structured plan with concrete steps, dependencies, risks, and verification points. Do not claim that work has already been executed."
	default:
		return "Chat mode: ask. Answer the user's question directly and concisely, using the provided context when relevant."
	}
}

// Chat handles POST /api/v1/ai/chat with SSE streaming.
func Chat(c *gin.Context) {
	var body chatReqBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	mode := normalizeChatMode(body.Mode)
	msgs := make([]*aichatv1.ChatMessage, 0, len(body.Messages)+1)
	msgs = append(msgs, &aichatv1.ChatMessage{Role: "system", Content: chatModeInstruction(mode)})
	for _, m := range body.Messages {
		msgs = append(msgs, &aichatv1.ChatMessage{Role: m.Role, Content: m.Content})
	}

	req := &aichatv1.ChatRequest{
		Messages:    msgs,
		FileContext: body.FileContext,
		Language:    body.Language,
		Temperature: body.Temperature,
		MaxTokens:   body.MaxTokens,
	}

	model := body.Model
	if model == "" {
		model = currentChatModel()
	}

	dataCh, errCh := aiChatRPC.ChatStream(
		c.Request.Context(),
		req,
		model,
		body.APIKey,
		body.BaseURL,
	)

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
