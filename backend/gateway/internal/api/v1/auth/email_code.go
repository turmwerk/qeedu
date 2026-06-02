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

	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/configs"
	"github.com/gin-gonic/gin"
)

type emailCodePurpose string

const (
	purposeLogin    emailCodePurpose = "login"
	purposeRegister emailCodePurpose = "register"
	purposeReset    emailCodePurpose = "reset"
)

type emailCodeEntry struct {
	code      string
	expiresAt time.Time
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

func sendEmailWithResend(to, subject, body string) error {
	apiKey := strings.TrimSpace(os.Getenv("RESEND_API_KEY"))
	from := strings.TrimSpace(os.Getenv("RESEND_EMAIL_FROM"))
	if apiKey == "" || from == "" {
		return fmt.Errorf("resend not configured")
	}

	displayFrom := from
	if !strings.Contains(displayFrom, "<") && strings.Contains(displayFrom, "@") {
		displayFrom = fmt.Sprintf("QeEdu <%s>", displayFrom)
	}

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
		return err
	}

	req, err := http.NewRequest(http.MethodPost, "https://api.resend.com/emails", bytes.NewReader(payload))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("User-Agent", "QeEdu/1.0")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= http.StatusOK && resp.StatusCode < http.StatusMultipleChoices {
		return nil
	}

	raw, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
	return fmt.Errorf("resend returned %s: %s", resp.Status, strings.TrimSpace(string(raw)))
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

func sendEmailWithSMTP(to, subject, body string) error {
	host := strings.TrimSpace(os.Getenv("SMTP_HOST"))
	port := strings.TrimSpace(os.Getenv("SMTP_PORT"))
	user := strings.TrimSpace(os.Getenv("SMTP_USER"))
	pass := strings.TrimSpace(os.Getenv("SMTP_PASSWORD"))
	from := strings.TrimSpace(os.Getenv("SMTP_FROM"))

	if host == "" || port == "" || from == "" {
		return fmt.Errorf("smtp not configured")
	}
	if _, err := strconv.Atoi(port); err != nil {
		return fmt.Errorf("invalid smtp port")
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

	return smtp.SendMail(host+":"+port, auth, from, []string{to}, []byte(msg))
}

func sendEmail(to, subject, body string) error {
	var failures []string
	if strings.TrimSpace(os.Getenv("RESEND_API_KEY")) != "" ||
		strings.TrimSpace(os.Getenv("RESEND_EMAIL_FROM")) != "" {
		if err := sendEmailWithResend(to, subject, body); err == nil {
			return nil
		} else {
			failures = append(failures, "resend: "+err.Error())
		}
	}

	if strings.TrimSpace(os.Getenv("SMTP_HOST")) != "" ||
		strings.TrimSpace(os.Getenv("SMTP_PORT")) != "" ||
		strings.TrimSpace(os.Getenv("SMTP_FROM")) != "" {
		if err := sendEmailWithSMTP(to, subject, body); err == nil {
			return nil
		} else {
			failures = append(failures, "smtp: "+err.Error())
		}
	}

	if len(failures) > 0 {
		return fmt.Errorf("%s", strings.Join(failures, "; "))
	}
	return fmt.Errorf("email provider not configured")
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
	if err := sendEmail(email, subject, body); err != nil {
		log.Printf("[auth] email code for %s (%s): %s; email send failed: %v", email, purpose, code, err)
		resp := gin.H{"ok": true, "message": "verification code generated"}
		if !configs.IsProd() {
			resp["dev_code"] = code
			c.JSON(http.StatusOK, resp)
			return
		}
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "邮箱服务未配置或发送失败，请稍后重试"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true, "message": "verification code sent"})
}
