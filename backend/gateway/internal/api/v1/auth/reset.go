package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	userRPC "github.com/turmwerk/qeedu/backend/gateway/internal/rpc/user"
)

type resetPasswordRequest struct {
	Email       string `json:"email" binding:"required,email"`
	Code        string `json:"code" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

// ResetPassword updates a local user's password and logs them in.
//
//	POST /api/v1/auth/reset-password
func ResetPassword(c *gin.Context) {
	var req resetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}

	email := normalizeEmail(req.Email)
	if !verifyEmailCode(email, purposeReset, req.Code) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "验证码错误或已过期"})
		return
	}

	u, err := userRPC.UpdatePassword(c.Request.Context(), email, req.NewPassword)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "重置密码失败: " + err.Error()})
		return
	}

	loginUser(c, u)
}
