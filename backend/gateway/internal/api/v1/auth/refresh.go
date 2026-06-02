package auth

import (
	"net/http"

	userRPC "github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/rpc/user"
	"github.com/gin-gonic/gin"
)

// Refresh reissues the auth cookie for the current user.
//
//	POST /api/v1/auth/refresh
func Refresh(c *gin.Context) {
	uid, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	u, err := userRPC.GetUserByID(c.Request.Context(), uint64(uid.(uint)))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user: " + err.Error()})
		return
	}

	loginUser(c, u)
}

// Logout clears the auth cookie.
//
//	POST /api/v1/auth/logout
func Logout(c *gin.Context) {
	clearAuthCookie(c)
	c.JSON(http.StatusOK, gin.H{"ok": true})
}
