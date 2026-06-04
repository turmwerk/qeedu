package auth

import (
	"net/http"
	"strings"
	"unicode/utf8"

	"github.com/gin-gonic/gin"
	userRPC "github.com/turmwerk/qeedu/backend/gateway/internal/rpc/user"
)

type registerRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Name     string `json:"name" binding:"required"`
	Code     string `json:"code" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
}

// Register creates a local email/password user and logs them in.
//
//	POST /api/v1/auth/register
func Register(c *gin.Context) {
	var req registerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}

	email := normalizeEmail(req.Email)
	name := strings.TrimSpace(req.Name)
	nameLen := utf8.RuneCountInString(name)
	if nameLen < 2 || nameLen > 30 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "用户名需为 2-30 个字符"})
		return
	}
	if !verifyEmailCode(email, purposeRegister, req.Code) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "验证码错误或已过期"})
		return
	}

	u, err := userRPC.CreatePasswordUser(
		c.Request.Context(),
		email,
		name,
		req.Password,
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "注册失败: " + err.Error()})
		return
	}

	loginUser(c, u)
}
