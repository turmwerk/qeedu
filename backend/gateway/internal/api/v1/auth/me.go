package auth

import (
	"net/http"

	userRPC "github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/rpc/user"
	"github.com/gin-gonic/gin"
)

// Me returns the current authenticated user's profile.
//
//	GET /api/v1/me
func Me(c *gin.Context) {
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

	c.JSON(http.StatusOK, gin.H{
		"id":         u.Id,
		"name":       u.Name,
		"email":      u.Email,
		"avatar_url": u.AvatarUrl,
		"provider":   u.Provider,
	})
}
