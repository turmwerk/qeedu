package auth

import (
	"bytes"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"html"
	"io"
	"log"
	"math/big"
	"net/http"
	"net/smtp"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/turmwerk/qeedu/backend/gateway/configs"
)

type emailCodePurpose string

const (
	purposeLogin       emailCodePurpose = "login"
	purposeRegister    emailCodePurpose = "register"
	purposeReset       emailCodePurpose = "reset"
	purposeChangeEmail emailCodePurpose = "change_email"
)

type emailCodeEntry struct {
	code      string
	expiresAt time.Time
}

type emailSendResult struct {
	provider string
	id       string
}

var emailCodes = struct {
	sync.Mutex
	values map[string]emailCodeEntry
}{values: make(map[string]emailCodeEntry)}

type sendCodeRequest struct {
	Email   string `json:"email" binding:"required,email"`
	Purpose string `json:"purpose"`
}

func normalizePurpose(value string) emailCodePurpose {
	switch emailCodePurpose(strings.ToLower(strings.TrimSpace(value))) {
	case purposeRegister:
		return purposeRegister
	case purposeReset:
		return purposeReset
	case purposeChangeEmail:
		return purposeChangeEmail
	default:
		return purposeLogin
	}
}

func normalizeEmail(email string) string {
	return strings.ToLower(strings.TrimSpace(email))
}

func codeKey(email string, purpose emailCodePurpose) string {
	return string(purpose) + ":" + normalizeEmail(email)
}

func generateEmailCode() (string, error) {
	max := big.NewInt(1_000_000)
	n, err := rand.Int(rand.Reader, max)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%06d", n.Int64()), nil
}

func storeEmailCode(email string, purpose emailCodePurpose, code string) {
	emailCodes.Lock()
	defer emailCodes.Unlock()
	emailCodes.values[codeKey(email, purpose)] = emailCodeEntry{
		code:      code,
		expiresAt: time.Now().Add(10 * time.Minute),
	}
}

func verifyEmailCode(email string, purpose emailCodePurpose, code string) bool {
	emailCodes.Lock()
	defer emailCodes.Unlock()

	key := codeKey(email, purpose)
	entry, ok := emailCodes.values[key]
	if !ok {
		return false
	}
	if time.Now().After(entry.expiresAt) {
		delete(emailCodes.values, key)
		return false
	}
	if entry.code != strings.TrimSpace(code) {
		return false
	}
	delete(emailCodes.values, key)
	return true
}

func VerifyEmailChangeCode(email string, code string) bool {
	return verifyEmailCode(email, purposeChangeEmail, code)
}

func normalizeResendFrom(from string) string {
	trimmed := strings.TrimSpace(from)
	left := strings.Index(trimmed, "<")
	right := strings.Index(trimmed, ">")
	if left > 0 && right > left {
		name := strings.TrimSpace(trimmed[:left])
		email := strings.TrimSpace(trimmed[left+1 : right])
		if name != "" && email != "" {
			return fmt.Sprintf("%s <%s>", name, email)
		}
	}
	if !strings.Contains(trimmed, "<") && strings.Contains(trimmed, "@") {
		return fmt.Sprintf("QeEdu <%s>", trimmed)
	}
	return trimmed
}

func maskEmailForLog(email string) string {
	normalized := normalizeEmail(email)
	parts := strings.SplitN(normalized, "@", 2)
	if len(parts) != 2 {
		return "***"
	}
	local := parts[0]
	if len(local) <= 2 {
		return local[:1] + "***@" + parts[1]
	}
	return local[:2] + "***@" + parts[1]
}

func sendEmailWithResend(to, subject, body string) (emailSendResult, error) {
	apiKey := strings.TrimSpace(os.Getenv("RESEND_API_KEY"))
	from := strings.TrimSpace(os.Getenv("RESEND_EMAIL_FROM"))
	if apiKey == "" || from == "" {
		return emailSendResult{}, fmt.Errorf("resend not configured")
	}

	displayFrom := normalizeResendFrom(from)

	htmlBody := fmt.Sprintf(
		`<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.7;color:#111827"><p>%s</p><pre style="font-size:24px;font-weight:700;letter-spacing:4px">%s</pre><p style="color:#64748b">10 分钟内有效。</p></div>`,
		html.EscapeString("你的 QeEdu 邮箱验证码是："),
		html.EscapeString(extractEmailCode(body)),
	)

	payload, err := json.Marshal(map[string]any{
		"from":    displayFrom,
		"to":      []string{to},
		"subject": subject,
		"text":    body,
		"html":    htmlBody,
	})
	if err != nil {
		return emailSendResult{}, err
	}

	req, err := http.NewRequest(http.MethodPost, "https://api.resend.com/emails", bytes.NewReader(payload))
	if err != nil {
		return emailSendResult{}, err
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("User-Agent", "QeEdu/1.0")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return emailSendResult{}, err
	}
	defer resp.Body.Close()

	raw, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
	if resp.StatusCode >= http.StatusOK && resp.StatusCode < http.StatusMultipleChoices {
		var parsed struct {
			ID string `json:"id"`
		}
		_ = json.Unmarshal(raw, &parsed)
		return emailSendResult{provider: "resend", id: parsed.ID}, nil
	}

	return emailSendResult{}, fmt.Errorf("resend returned %s: %s", resp.Status, strings.TrimSpace(string(raw)))
}

func extractEmailCode(body string) string {
	var digits strings.Builder
	for _, ch := range body {
		if ch >= '0' && ch <= '9' {
			digits.WriteRune(ch)
			if digits.Len() == 6 {
				return digits.String()
			}
			continue
		}
		digits.Reset()
	}
	return ""
}

func sendEmailWithSMTP(to, subject, body string) (emailSendResult, error) {
	host := strings.TrimSpace(os.Getenv("SMTP_HOST"))
	port := strings.TrimSpace(os.Getenv("SMTP_PORT"))
	user := strings.TrimSpace(os.Getenv("SMTP_USER"))
	pass := strings.TrimSpace(os.Getenv("SMTP_PASSWORD"))
	from := strings.TrimSpace(os.Getenv("SMTP_FROM"))

	if host == "" || port == "" || from == "" {
		return emailSendResult{}, fmt.Errorf("smtp not configured")
	}
	if _, err := strconv.Atoi(port); err != nil {
		return emailSendResult{}, fmt.Errorf("invalid smtp port")
	}

	var auth smtp.Auth
	if user != "" || pass != "" {
		auth = smtp.PlainAuth("", user, pass, host)
	}

	msg := strings.Join([]string{
		"From: " + from,
		"To: " + to,
		"Subject: " + subject,
		"Content-Type: text/plain; charset=UTF-8",
		"",
		body,
	}, "\r\n")

	if err := smtp.SendMail(host+":"+port, auth, from, []string{to}, []byte(msg)); err != nil {
		return emailSendResult{}, err
	}
	return emailSendResult{provider: "smtp"}, nil
}

func sendEmail(to, subject, body string) (emailSendResult, error) {
	var failures []string
	if strings.TrimSpace(os.Getenv("RESEND_API_KEY")) != "" ||
		strings.TrimSpace(os.Getenv("RESEND_EMAIL_FROM")) != "" {
		if result, err := sendEmailWithResend(to, subject, body); err == nil {
			return result, nil
		} else {
			failures = append(failures, "resend: "+err.Error())
		}
	}

	if strings.TrimSpace(os.Getenv("SMTP_HOST")) != "" ||
		strings.TrimSpace(os.Getenv("SMTP_PORT")) != "" ||
		strings.TrimSpace(os.Getenv("SMTP_FROM")) != "" {
		if result, err := sendEmailWithSMTP(to, subject, body); err == nil {
			return result, nil
		} else {
			failures = append(failures, "smtp: "+err.Error())
		}
	}

	if len(failures) > 0 {
		return emailSendResult{}, fmt.Errorf("%s", strings.Join(failures, "; "))
	}
	return emailSendResult{}, fmt.Errorf("email provider not configured")
}

// SendCode sends or returns a development email verification code.
//
//	POST /api/v1/auth/send-code
func SendCode(c *gin.Context) {
	var req sendCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}

	email := normalizeEmail(req.Email)
	purpose := normalizePurpose(req.Purpose)
	code, err := generateEmailCode()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate code"})
		return
	}

	storeEmailCode(email, purpose, code)

	subject := "QeEdu 邮箱验证码"
	body := fmt.Sprintf("你的验证码是：%s\n\n用途：%s\n10 分钟内有效。", code, purpose)
	result, err := sendEmail(email, subject, body)
	if err != nil {
		if configs.IsProd() {
			log.Printf("[auth] email code for %s (%s) send failed: %v", email, purpose, err)
		} else {
			log.Printf("[auth] email code for %s (%s): %s; email send failed: %v", email, purpose, code, err)
		}
		resp := gin.H{"ok": true, "message": "verification code generated"}
		if !configs.IsProd() {
			resp["dev_code"] = code
			c.JSON(http.StatusOK, resp)
			return
		}
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "邮箱服务未配置或发送失败，请稍后重试"})
		return
	}

	log.Printf("[auth] email code accepted for %s (%s) via %s id=%s", maskEmailForLog(email), purpose, result.provider, result.id)

	c.JSON(http.StatusOK, gin.H{
		"ok":          true,
		"message":     "verification code accepted",
		"provider":    result.provider,
		"accepted_at": time.Now().UTC().Format(time.RFC3339),
	})
}
