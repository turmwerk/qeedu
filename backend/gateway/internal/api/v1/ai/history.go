package ai

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"

	db "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/mysql"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

const (
	maxDialogIDLength = 191
	maxStoredMessages = 200
	maxStoredFiles    = 20
	maxStoredVersions = 20
	maxStoredText     = 20000
	maxStoredFileName = 255
	maxStoredFileType = 120
)

type ChatConversation struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null;uniqueIndex:idx_ai_conversation_user_dialog;index"`
	DialogID  string    `gorm:"size:191;not null;uniqueIndex:idx_ai_conversation_user_dialog;index"`
	Messages  string    `gorm:"type:longtext;not null"`
	CreatedAt time.Time `gorm:"not null"`
	UpdatedAt time.Time `gorm:"not null"`
}

func (ChatConversation) TableName() string {
	return "ai_conversations"
}

type storedDialogFile struct {
	Name         string `json:"name"`
	Type         string `json:"type,omitempty"`
	Size         int64  `json:"size,omitempty"`
	LastModified int64  `json:"lastModified,omitempty"`
}

type storedDialogMessage struct {
	From         string             `json:"from"`
	Text         string             `json:"text"`
	Files        []storedDialogFile `json:"files,omitempty"`
	Versions     []string           `json:"versions,omitempty"`
	VersionIndex *int               `json:"versionIndex,omitempty"`
}

type saveDialogMessagesRequest struct {
	Messages []storedDialogMessage `json:"messages"`
}

func AutoMigrate() error {
	return db.DB.AutoMigrate(&ChatConversation{})
}

func GetDialogMessages(c *gin.Context) {
	userID := currentUserID(c)
	if userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "missing user id"})
		return
	}
	dialogID, ok := dialogIDParam(c)
	if !ok {
		return
	}

	var row ChatConversation
	err := db.DB.Where("user_id = ? AND dialog_id = ?", userID, dialogID).First(&row).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusOK, gin.H{"messages": []storedDialogMessage{}})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var messages []storedDialogMessage
	if err := json.Unmarshal([]byte(row.Messages), &messages); err != nil {
		c.JSON(http.StatusOK, gin.H{"messages": []storedDialogMessage{}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"messages": sanitizeStoredMessages(messages)})
}

func SaveDialogMessages(c *gin.Context) {
	userID := currentUserID(c)
	if userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "missing user id"})
		return
	}
	dialogID, ok := dialogIDParam(c)
	if !ok {
		return
	}

	var body saveDialogMessagesRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	messages := sanitizeStoredMessages(body.Messages)
	raw, err := json.Marshal(messages)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var row ChatConversation
	err = db.DB.
		Where("user_id = ? AND dialog_id = ?", userID, dialogID).
		Assign(ChatConversation{Messages: string(raw)}).
		FirstOrCreate(&row, ChatConversation{UserID: userID, DialogID: dialogID}).
		Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func DeleteDialogMessages(c *gin.Context) {
	userID := currentUserID(c)
	if userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "missing user id"})
		return
	}
	dialogID, ok := dialogIDParam(c)
	if !ok {
		return
	}

	if err := db.DB.Where("user_id = ? AND dialog_id = ?", userID, dialogID).Delete(&ChatConversation{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func currentUserID(c *gin.Context) uint {
	raw, ok := c.Get("user_id")
	if !ok {
		return 0
	}
	switch value := raw.(type) {
	case uint:
		return value
	case int:
		if value > 0 {
			return uint(value)
		}
	case float64:
		if value > 0 {
			return uint(value)
		}
	}
	return 0
}

func dialogIDParam(c *gin.Context) (string, bool) {
	dialogID := strings.TrimSpace(c.Param("dialogId"))
	if dialogID == "" || len(dialogID) > maxDialogIDLength {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid dialog id"})
		return "", false
	}
	return dialogID, true
}

func sanitizeStoredMessages(messages []storedDialogMessage) []storedDialogMessage {
	if len(messages) > maxStoredMessages {
		messages = messages[len(messages)-maxStoredMessages:]
	}

	out := make([]storedDialogMessage, 0, len(messages))
	for _, message := range messages {
		from := strings.ToLower(strings.TrimSpace(message.From))
		if from != "user" && from != "bot" {
			continue
		}

		next := storedDialogMessage{
			From:         from,
			Text:         truncate(message.Text, maxStoredText),
			VersionIndex: message.VersionIndex,
		}

		if len(message.Files) > maxStoredFiles {
			message.Files = message.Files[:maxStoredFiles]
		}
		for _, file := range message.Files {
			name := truncate(strings.TrimSpace(file.Name), maxStoredFileName)
			if name == "" {
				continue
			}
			next.Files = append(next.Files, storedDialogFile{
				Name:         name,
				Type:         truncate(strings.TrimSpace(file.Type), maxStoredFileType),
				Size:         file.Size,
				LastModified: file.LastModified,
			})
		}

		if len(message.Versions) > maxStoredVersions {
			message.Versions = message.Versions[len(message.Versions)-maxStoredVersions:]
		}
		for _, version := range message.Versions {
			next.Versions = append(next.Versions, truncate(version, maxStoredText))
		}

		out = append(out, next)
	}
	return out
}

func truncate(value string, maxLen int) string {
	if len(value) <= maxLen {
		return value
	}
	runes := []rune(value)
	if len(runes) <= maxLen {
		return value
	}
	return string(runes[:maxLen])
}
