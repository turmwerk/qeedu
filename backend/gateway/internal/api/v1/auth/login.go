package auth

import (
	"net/http"
	"strings"

	userRPC "github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/rpc/user"
	"github.com/gin-gonic/gin"
)

// loginRequest 统一登录请求体
type loginRequest struct {
	// "oauth" | "password" | "email_code"
	Method string `json:"method" binding:"required,oneof=oauth password email_code"`

	// ── OAuth 登录字段 ──
	Provider string `json:"provider,omitempty"` // "github" | "google" | "microsoft"

	// ── 账密登录字段（邮箱或用户名 + 密码）──
	Account  string `json:"account,omitempty"` // 邮箱或用户名
	Password string `json:"password,omitempty"`

	// ── 邮箱验证码登录字段 ──
	Email string `json:"email,omitempty"`
	Code  string `json:"code,omitempty"`
}

// Login 统一登录入口
//
//	POST /api/v1/auth/login
func Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}

	switch req.Method {
	case "oauth":
		handleOAuthLogin(c, &req)
	case "password":
		handlePasswordLogin(c, &req)
	case "email_code":
		handleEmailCodeLogin(c, &req)
	}
}

// handleOAuthLogin 处理 OAuth 重定向登录
// 前端调用此接口后，后端返回对应 provider 的授权 URL，前端跳转过去
func handleOAuthLogin(c *gin.Context, req *loginRequest) {
	switch req.Provider {
	case "github":
		c.JSON(http.StatusOK, gin.H{
			"redirect_url": "/api/v1/auth/github",
		})
	case "google":
		c.JSON(http.StatusOK, gin.H{
			"redirect_url": "/api/v1/auth/google",
		})
	case "microsoft":
		c.JSON(http.StatusOK, gin.H{
			"redirect_url": "/api/v1/auth/microsoft",
		})
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "unsupported oauth provider: " + req.Provider})
	}
}

// handlePasswordLogin 处理邮箱/用户名 + 密码登录
func handlePasswordLogin(c *gin.Context, req *loginRequest) {
	account := strings.TrimSpace(req.Account)
	if account == "" || req.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "account and password are required"})
		return
	}

	u, err := userRPC.VerifyPassword(c.Request.Context(), account, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "账号或密码错误"})
		return
	}

	loginUser(c, u)
}

// handleEmailCodeLogin 处理邮箱验证码登录
func handleEmailCodeLogin(c *gin.Context, req *loginRequest) {
	email := normalizeEmail(req.Email)
	if email == "" || strings.TrimSpace(req.Code) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "email and code are required"})
		return
	}
	if !verifyEmailCode(email, purposeLogin, req.Code) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "验证码错误或已过期"})
		return
	}

	u, err := userRPC.FindOrCreateEmailUser(c.Request.Context(), email, "")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load user: " + err.Error()})
		return
	}

	loginUser(c, u)
}
