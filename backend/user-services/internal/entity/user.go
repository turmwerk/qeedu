package entity

import "time"

// User represents a registered user. OAuth users have Provider + ProviderID set.
type User struct {
	ID           uint   `gorm:"primaryKey;autoIncrement"`
	Provider     string `gorm:"size:20;not null;uniqueIndex:idx_provider_pid"` // "github" | "google" | "email"
	ProviderID   string `gorm:"size:128;not null;uniqueIndex:idx_provider_pid"`
	Name         string `gorm:"size:100;index"`
	Email        string `gorm:"size:200;index"`
	PasswordHash string `gorm:"size:255"`
	AvatarURL    string `gorm:"size:2048"`
	Bio          string `gorm:"size:500"`
	Role         string `gorm:"size:60"`
	School       string `gorm:"size:120"`
	Major        string `gorm:"size:120"`
	Timezone     string `gorm:"size:80"`
	Locale       string `gorm:"size:20"`
	Status       string `gorm:"size:30;index;default:active"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type UserIdentity struct {
	ID             uint   `gorm:"primaryKey;autoIncrement"`
	UserID         uint   `gorm:"not null;index;uniqueIndex:idx_user_provider"`
	Provider       string `gorm:"size:30;not null;uniqueIndex:idx_provider_user;uniqueIndex:idx_user_provider"`
	ProviderUserID string `gorm:"size:160;not null;uniqueIndex:idx_provider_user"`
	ProviderEmail  string `gorm:"size:200;index"`
	ProviderName   string `gorm:"size:120"`
	AvatarURL      string `gorm:"size:2048"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
	LastUsedAt     *time.Time
}

type UserPreference struct {
	UserID               uint   `gorm:"primaryKey"`
	Language             string `gorm:"size:20;default:zh-CN"`
	Theme                string `gorm:"size:20;default:system"`
	EffectsEnabled       bool   `gorm:"default:true"`
	EmailNotifications   bool   `gorm:"default:true"`
	ProductNotifications bool   `gorm:"default:true"`
	SecurityEmails       bool   `gorm:"default:true"`
	DefaultModel         string `gorm:"size:80;default:deepseek-v4-flash"`
	CodeModel            string `gorm:"size:80;default:deepseek-v4-flash"`
	OutputStyle          string `gorm:"size:80;default:balanced"`
	ContextCurrentFile   bool   `gorm:"default:true"`
	ContextProjectFiles  bool   `gorm:"default:true"`
	ContextHistory       bool   `gorm:"default:false"`
	ShareUsageData       bool   `gorm:"default:false"`
	ProfileVisible       string `gorm:"size:40;default:private"`
	DefaultAccountPage   string `gorm:"size:80;default:/account"`
	CreatedAt            time.Time
	UpdatedAt            time.Time
}

type AccountEvent struct {
	ID        uint   `gorm:"primaryKey;autoIncrement"`
	UserID    uint   `gorm:"not null;index"`
	Type      string `gorm:"size:80;not null;index"`
	Message   string `gorm:"size:500"`
	IP        string `gorm:"size:80"`
	UserAgent string `gorm:"size:300"`
	CreatedAt time.Time
}

type AccountFeedback struct {
	ID        uint   `gorm:"primaryKey;autoIncrement"`
	UserID    uint   `gorm:"not null;index"`
	Category  string `gorm:"size:80"`
	Message   string `gorm:"size:1000"`
	Status    string `gorm:"size:40;default:open"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
