package account

import (
	"errors"
	"net/http"
	"strings"
	"unicode/utf8"

	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/configs"
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/api/v1/auth"
	db "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/mysql"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type profileResponse struct {
	ID        uint   `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	AvatarURL string `json:"avatar_url"`
	Bio       string `json:"bio"`
	Role      string `json:"role"`
	School    string `json:"school"`
	Major     string `json:"major"`
	Timezone  string `json:"timezone"`
	Locale    string `json:"locale"`
	Status    string `json:"status"`
	Provider  string `json:"provider"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type identityResponse struct {
	Provider      string `json:"provider"`
	ProviderEmail string `json:"provider_email"`
	ProviderName  string `json:"provider_name"`
	AvatarURL     string `json:"avatar_url"`
	Linked        bool   `json:"linked"`
	LastUsedAt    string `json:"last_used_at,omitempty"`
}

type OAuthIdentityInput struct {
	Provider       string
	ProviderUserID string
	ProviderEmail  string
	ProviderName   string
	AvatarURL      string
}

type overviewResponse struct {
	Profile      profileResponse    `json:"profile"`
	Preferences  UserPreference     `json:"preferences"`
	Identities   []identityResponse `json:"identities"`
	HasPassword  bool               `json:"has_password"`
	RecentEvents []AccountEvent     `json:"recent_events"`
}

type updateProfileRequest struct {
	Name      string `json:"name"`
	AvatarURL string `json:"avatar_url"`
	Bio       string `json:"bio"`
	Role      string `json:"role"`
	School    string `json:"school"`
	Major     string `json:"major"`
	Timezone  string `json:"timezone"`
	Locale    string `json:"locale"`
}

type updateEmailRequest struct {
	Email string `json:"email" binding:"required,email"`
	Code  string `json:"code" binding:"required"`
}

type changePasswordRequest struct {
	CurrentPassword string `json:"current_password"`
	NewPassword     string `json:"new_password" binding:"required,min=6"`
}

type feedbackRequest struct {
	Category string `json:"category"`
	Message  string `json:"message" binding:"required"`
}

type deleteAccountRequest struct {
	Password string `json:"password"`
	Confirm  string `json:"confirm" binding:"required"`
}

func currentUserID(c *gin.Context) uint {
	raw, ok := c.Get("user_id")
	if !ok {
		return 0
	}
	switch value := raw.(type) {
	case uint:
		return value
	case uint64:
		return uint(value)
	case int:
		if value > 0 {
			return uint(value)
		}
	}
	return 0
}

func normalizeEmail(value string) string {
	return strings.ToLower(strings.TrimSpace(value))
}

func sanitize(value string, max int) string {
	value = strings.TrimSpace(value)
	if max <= 0 {
		return value
	}
	runes := []rune(value)
	if len(runes) > max {
		return string(runes[:max])
	}
	return value
}

func loadUser(uid uint) (*User, error) {
	var user User
	if err := db.DB.First(&user, uid).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func ensurePreference(uid uint) (UserPreference, error) {
	var pref UserPreference
	err := db.DB.Where("user_id = ?", uid).FirstOrCreate(&pref, UserPreference{UserID: uid}).Error
	return pref, err
}

func recordEvent(c *gin.Context, uid uint, typ string, message string) {
	event := AccountEvent{
		UserID:    uid,
		Type:      typ,
		Message:   sanitize(message, 500),
		IP:        sanitize(c.ClientIP(), 80),
		UserAgent: sanitize(c.GetHeader("User-Agent"), 300),
	}
	_ = db.DB.Create(&event).Error
}

func userToProfile(u *User) profileResponse {
	return profileResponse{
		ID:        u.ID,
		Name:      u.Name,
		Email:     u.Email,
		AvatarURL: u.AvatarURL,
		Bio:       u.Bio,
		Role:      u.Role,
		School:    u.School,
		Major:     u.Major,
		Timezone:  u.Timezone,
		Locale:    u.Locale,
		Status:    u.Status,
		Provider:  u.Provider,
		CreatedAt: u.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt: u.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

func listIdentities(uid uint, user *User) []identityResponse {
	var rows []UserIdentity
	_ = db.DB.Where("user_id = ?", uid).Order("provider asc").Find(&rows).Error
	byProvider := map[string]identityResponse{}
	for _, row := range rows {
		item := identityResponse{
			Provider:      row.Provider,
			ProviderEmail: row.ProviderEmail,
			ProviderName:  row.ProviderName,
			AvatarURL:     row.AvatarURL,
			Linked:        true,
		}
		if row.LastUsedAt != nil {
			item.LastUsedAt = row.LastUsedAt.Format("2006-01-02T15:04:05Z07:00")
		}
		byProvider[row.Provider] = item
	}
	if user.Provider != "" && user.ProviderID != "" {
		if _, ok := byProvider[user.Provider]; !ok {
			byProvider[user.Provider] = identityResponse{
				Provider:      user.Provider,
				ProviderEmail: user.Email,
				ProviderName:  user.Name,
				AvatarURL:     user.AvatarURL,
				Linked:        true,
			}
		}
	}

	providers := []string{"email", "github", "google"}
	out := make([]identityResponse, 0, len(providers))
	for _, provider := range providers {
		item, ok := byProvider[provider]
		if !ok {
			item = identityResponse{Provider: provider, Linked: false}
		}
		out = append(out, item)
	}
	return out
}

func LinkOAuthIdentity(uid uint, input OAuthIdentityInput) error {
	provider := strings.ToLower(strings.TrimSpace(input.Provider))
	providerUserID := strings.TrimSpace(input.ProviderUserID)
	if uid == 0 || provider == "" || providerUserID == "" {
		return errors.New("invalid identity")
	}
	var existing UserIdentity
	if err := db.DB.Where("provider = ? AND provider_user_id = ? AND user_id <> ?", provider, providerUserID, uid).First(&existing).Error; err == nil {
		return errors.New("identity already linked to another account")
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	var providerUser User
	if err := db.DB.Where("provider = ? AND provider_id = ? AND id <> ?", provider, providerUserID, uid).First(&providerUser).Error; err == nil {
		return errors.New("identity already registered by another account")
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	return db.DB.Where("user_id = ? AND provider = ?", uid, provider).Assign(UserIdentity{
		ProviderUserID: providerUserID,
		ProviderEmail:  normalizeEmail(input.ProviderEmail),
		ProviderName:   sanitize(input.ProviderName, 120),
		AvatarURL:      sanitize(input.AvatarURL, 2048),
	}).FirstOrCreate(&UserIdentity{
		UserID:         uid,
		Provider:       provider,
		ProviderUserID: providerUserID,
	}).Error
}

func Overview(c *gin.Context) {
	uid := currentUserID(c)
	user, err := loadUser(uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load user"})
		return
	}
	pref, err := ensurePreference(uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load preferences"})
		return
	}
	var events []AccountEvent
	_ = db.DB.Where("user_id = ?", uid).Order("created_at desc").Limit(8).Find(&events).Error
	c.JSON(http.StatusOK, overviewResponse{
		Profile:      userToProfile(user),
		Preferences:  pref,
		Identities:   listIdentities(uid, user),
		HasPassword:  user.PasswordHash != "",
		RecentEvents: events,
	})
}

func GetProfile(c *gin.Context) {
	user, err := loadUser(currentUserID(c))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load user"})
		return
	}
	c.JSON(http.StatusOK, userToProfile(user))
}

func UpdateProfile(c *gin.Context) {
	uid := currentUserID(c)
	var req updateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}
	name := sanitize(req.Name, 30)
	if utf8.RuneCountInString(name) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "用户名需为 2-30 个字符"})
		return
	}
	var dup User
	if err := db.DB.Where("id <> ? AND provider = ? AND name = ?", uid, "email", name).First(&dup).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "用户名已被使用"})
		return
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check username"})
		return
	}

	user, err := loadUser(uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load user"})
		return
	}
	user.Name = name
	user.AvatarURL = sanitize(req.AvatarURL, 2048)
	user.Bio = sanitize(req.Bio, 500)
	user.Role = sanitize(req.Role, 60)
	user.School = sanitize(req.School, 120)
	user.Major = sanitize(req.Major, 120)
	user.Timezone = sanitize(req.Timezone, 80)
	user.Locale = sanitize(req.Locale, 20)
	if user.Status == "" {
		user.Status = "active"
	}
	if err := db.DB.Save(user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update profile"})
		return
	}
	recordEvent(c, uid, "profile.update", "更新个人资料")
	c.JSON(http.StatusOK, userToProfile(user))
}

func UpdateEmail(c *gin.Context) {
	var req updateEmailRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}
	uid := currentUserID(c)
	email := normalizeEmail(req.Email)
	if !auth.VerifyEmailChangeCode(email, req.Code) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "验证码错误或已过期"})
		return
	}
	var existing User
	if err := db.DB.Where("id <> ? AND email = ?", uid, email).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "邮箱已被其他账号使用"})
		return
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check email"})
		return
	}
	user, err := loadUser(uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load user"})
		return
	}
	user.Email = email
	if user.Provider == "email" {
		user.ProviderID = email
	}
	if err := db.DB.Save(user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update email"})
		return
	}
	_ = db.DB.Where("user_id = ? AND provider = ?", uid, "email").Assign(UserIdentity{
		ProviderEmail:  email,
		ProviderName:   user.Name,
		ProviderUserID: email,
	}).FirstOrCreate(&UserIdentity{
		UserID:         uid,
		Provider:       "email",
		ProviderUserID: email,
	}).Error
	recordEvent(c, uid, "email.update", "更新绑定邮箱")
	c.JSON(http.StatusOK, userToProfile(user))
}

func ChangePassword(c *gin.Context) {
	uid := currentUserID(c)
	var req changePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}
	user, err := loadUser(uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load user"})
		return
	}
	if user.PasswordHash != "" {
		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.CurrentPassword)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "当前密码错误"})
			return
		}
	}
	hashed, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to hash password"})
		return
	}
	user.PasswordHash = string(hashed)
	if user.Provider == "" {
		user.Provider = "email"
		user.ProviderID = user.Email
	}
	if err := db.DB.Save(user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update password"})
		return
	}
	_ = db.DB.Where("user_id = ? AND provider = ?", uid, "email").Assign(UserIdentity{
		ProviderEmail:  user.Email,
		ProviderName:   user.Name,
		ProviderUserID: user.Email,
	}).FirstOrCreate(&UserIdentity{
		UserID:         uid,
		Provider:       "email",
		ProviderUserID: user.Email,
	}).Error
	recordEvent(c, uid, "password.update", "更新登录密码")
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func GetPreferences(c *gin.Context) {
	pref, err := ensurePreference(currentUserID(c))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load preferences"})
		return
	}
	c.JSON(http.StatusOK, pref)
}

func UpdatePreferences(c *gin.Context) {
	uid := currentUserID(c)
	pref, err := ensurePreference(uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load preferences"})
		return
	}
	if err := c.ShouldBindJSON(&pref); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}
	pref.UserID = uid
	if pref.DefaultModel == "" {
		pref.DefaultModel = "deepseek-v4-flash"
	}
	if pref.CodeModel == "" {
		pref.CodeModel = "deepseek-v4-flash"
	}
	if err := db.DB.Save(&pref).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update preferences"})
		return
	}
	recordEvent(c, uid, "preferences.update", "更新账户偏好")
	c.JSON(http.StatusOK, pref)
}

func GetIdentities(c *gin.Context) {
	user, err := loadUser(currentUserID(c))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": listIdentities(user.ID, user)})
}

func UnlinkIdentity(c *gin.Context) {
	uid := currentUserID(c)
	provider := strings.ToLower(strings.TrimSpace(c.Param("provider")))
	if provider == "email" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "邮箱登录方式不能在这里解绑"})
		return
	}
	result := db.DB.Where("user_id = ? AND provider = ?", uid, provider).Delete(&UserIdentity{})
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to unlink identity"})
		return
	}
	recordEvent(c, uid, "identity.unlink", "解绑 "+provider)
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func Events(c *gin.Context) {
	var events []AccountEvent
	if err := db.DB.Where("user_id = ?", currentUserID(c)).Order("created_at desc").Limit(100).Find(&events).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load events"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": events})
}

func Feedback(c *gin.Context) {
	var req feedbackRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}
	feedback := AccountFeedback{
		UserID:   currentUserID(c),
		Category: sanitize(req.Category, 80),
		Message:  sanitize(req.Message, 1000),
		Status:   "open",
	}
	if feedback.Message == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "反馈内容不能为空"})
		return
	}
	if err := db.DB.Create(&feedback).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to submit feedback"})
		return
	}
	recordEvent(c, feedback.UserID, "feedback.create", "提交帮助反馈")
	c.JSON(http.StatusOK, feedback)
}

func DeleteAccount(c *gin.Context) {
	uid := currentUserID(c)
	var req deleteAccountRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}
	if strings.TrimSpace(req.Confirm) != "DELETE" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请输入 DELETE 确认注销"})
		return
	}
	user, err := loadUser(uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load user"})
		return
	}
	if user.PasswordHash != "" {
		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "密码错误"})
			return
		}
	}
	user.Status = "deleted"
	user.Name = "已注销用户"
	user.Email = ""
	user.AvatarURL = ""
	user.Bio = ""
	user.PasswordHash = ""
	if err := db.DB.Save(user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete account"})
		return
	}
	_ = db.DB.Where("user_id = ?", uid).Delete(&UserIdentity{}).Error
	recordEvent(c, uid, "account.delete", "注销账户")
	c.SetCookie("edu_token", "", -1, "/", "", configs.IsProd(), true)
	c.JSON(http.StatusOK, gin.H{"ok": true})
}
