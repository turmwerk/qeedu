package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// AuthRequired validates the JWT in the Authorization header
// and injects user_id / name into the context.
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := ""
		h := c.GetHeader("Authorization")
		if h != "" && strings.HasPrefix(h, "Bearer ") {
			token = strings.TrimPrefix(h, "Bearer ")
		}
		if token == "" && strings.EqualFold(c.GetHeader("Upgrade"), "websocket") {
			token = strings.TrimSpace(c.Query("token"))
		}
		if token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing or invalid token"})
			return
		}

		claims, err := ParseToken(token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token: " + err.Error()})
			return
		}

		if uid, ok := claims["user_id"].(float64); ok {
			c.Set("user_id", uint(uid))
		}
		if name, ok := claims["name"].(string); ok {
			c.Set("name", name)
		}

		c.Next()
	}
}
