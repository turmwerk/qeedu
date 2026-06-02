package auth

import (
	"crypto/rand"
	"fmt"
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

func sendEmail(to, subject, body string) error {
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
		log.Printf("[auth] email code for %s (%s): %s; smtp skipped: %v", email, purpose, code, err)
		resp := gin.H{"ok": true, "message": "verification code generated"}
		if !configs.IsProd() {
			resp["dev_code"] = code
		}
		c.JSON(http.StatusOK, resp)
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true, "message": "verification code sent"})
}
