package auth

import (
	"net/http"
	"strings"

	userRPC "github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/rpc/user"
	"github.com/gin-gonic/gin"
)

type registerRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Name     string `json:"name"`
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
	if !verifyEmailCode(email, purposeRegister, req.Code) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "验证码错误或已过期"})
		return
	}

	u, err := userRPC.CreatePasswordUser(
		c.Request.Context(),
		email,
		strings.TrimSpace(req.Name),
		req.Password,
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "注册失败: " + err.Error()})
		return
	}

	loginUser(c, u)
}
