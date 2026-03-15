package entity

import "time"

// User represents a registered user. OAuth users have Provider + ProviderID set.
type User struct {
	ID         uint   `gorm:"primaryKey;autoIncrement"`
	Provider   string `gorm:"size:20;not null;uniqueIndex:idx_provider_pid"` // "github" | "google" | "local"
	ProviderID string `gorm:"size:128;not null;uniqueIndex:idx_provider_pid"`
	Name       string `gorm:"size:100"`
	Email      string `gorm:"size:200;index"`
	AvatarURL  string `gorm:"size:500"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
}
