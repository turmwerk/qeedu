package auth

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/turmwerk/qeedu/backend/gateway/configs"
	"github.com/turmwerk/qeedu/backend/gateway/internal/middleware"
	userv1 "github.com/turmwerk/qeedu/backend/pkg/pb/user/v1"
)

const authCookieName = "edu_token"

func setAuthCookie(c *gin.Context, token string) {
	c.SetCookie(
		authCookieName,
		token,
		int((7 * 24 * time.Hour).Seconds()),
		"/",
		"",
		configs.IsProd(),
		true,
	)
}

func clearAuthCookie(c *gin.Context) {
	c.SetCookie(authCookieName, "", -1, "/", "", configs.IsProd(), true)
}

func loginUser(c *gin.Context, u *userv1.User) {
	if u == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "missing user"})
		return
	}
	token, err := middleware.GenerateToken(uint(u.Id), u.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}
	setAuthCookie(c, token)
	c.JSON(http.StatusOK, gin.H{
		"id":         u.Id,
		"name":       u.Name,
		"email":      u.Email,
		"avatar_url": u.AvatarUrl,
		"provider":   u.Provider,
	})
}
