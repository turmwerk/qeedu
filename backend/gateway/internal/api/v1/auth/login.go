package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// loginRequest 统一登录请求体
type loginRequest struct {
	// "oauth" | "password" | "email_code"
	Method string `json:"method" binding:"required,oneof=oauth password email_code"`

	// ── OAuth 登录字段 ──
	Provider string `json:"provider,omitempty"` // "github" | "google"

	// ── 账密登录字段（邮箱或用户名 + 密码）──
	Account  string `json:"account,omitempty"`  // 邮箱或用户名
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
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "unsupported oauth provider: " + req.Provider})
	}
}

// handlePasswordLogin 处理邮箱/用户名 + 密码登录
func handlePasswordLogin(c *gin.Context, req *loginRequest) {
	// TODO: 实现账密登录
	// 1. 校验 account + password 非空
	// 2. 查询用户（按邮箱或用户名）
	// 3. 校验密码
	// 4. 生成 JWT 返回
	c.JSON(http.StatusNotImplemented, gin.H{"error": "password login not implemented yet"})
}

// handleEmailCodeLogin 处理邮箱验证码登录
func handleEmailCodeLogin(c *gin.Context, req *loginRequest) {
	// TODO: 实现邮箱验证码登录
	// 1. 校验 email + code 非空
	// 2. 从 Redis 校验验证码
	// 3. 查询或创建用户
	// 4. 生成 JWT 返回
	c.JSON(http.StatusNotImplemented, gin.H{"error": "email code login not implemented yet"})
}
