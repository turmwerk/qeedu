package account

import "time"

type User struct {
	ID           uint   `gorm:"primaryKey;autoIncrement"`
	Provider     string `gorm:"size:20;not null;uniqueIndex:idx_provider_pid"`
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

func (User) TableName() string {
	return "users"
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
	UserID               uint      `gorm:"primaryKey" json:"user_id"`
	Language             string    `gorm:"size:20;default:zh-CN" json:"language"`
	Theme                string    `gorm:"size:20;default:system" json:"theme"`
	EffectsEnabled       bool      `gorm:"default:true" json:"effects_enabled"`
	EmailNotifications   bool      `gorm:"default:true" json:"email_notifications"`
	ProductNotifications bool      `gorm:"default:true" json:"product_notifications"`
	SecurityEmails       bool      `gorm:"default:true" json:"security_emails"`
	DefaultModel         string    `gorm:"size:80;default:deepseek-v4-flash" json:"default_model"`
	CodeModel            string    `gorm:"size:80;default:deepseek-v4-flash" json:"code_model"`
	OutputStyle          string    `gorm:"size:80;default:balanced" json:"output_style"`
	ContextCurrentFile   bool      `gorm:"default:true" json:"context_current_file"`
	ContextProjectFiles  bool      `gorm:"default:true" json:"context_project_files"`
	ContextHistory       bool      `gorm:"default:false" json:"context_history"`
	ShareUsageData       bool      `gorm:"default:false" json:"share_usage_data"`
	ProfileVisible       string    `gorm:"size:40;default:private" json:"profile_visible"`
	DefaultAccountPage   string    `gorm:"size:80;default:/account" json:"default_account_page"`
	CreatedAt            time.Time `json:"created_at"`
	UpdatedAt            time.Time `json:"updated_at"`
}

type AccountEvent struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    uint      `gorm:"not null;index" json:"user_id"`
	Type      string    `gorm:"size:80;not null;index" json:"type"`
	Message   string    `gorm:"size:500" json:"message"`
	IP        string    `gorm:"size:80" json:"ip"`
	UserAgent string    `gorm:"size:300" json:"user_agent"`
	CreatedAt time.Time `json:"created_at"`
}

type AccountFeedback struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    uint      `gorm:"not null;index" json:"user_id"`
	Category  string    `gorm:"size:80" json:"category"`
	Message   string    `gorm:"size:1000" json:"message"`
	Status    string    `gorm:"size:40;default:open" json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
