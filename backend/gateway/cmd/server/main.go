package main

import (
	"log"
	"net/http"

	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/configs"
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/api"
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/middleware"
	userRPC "github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/rpc/user"
	"github.com/gin-gonic/gin"
)

func main() {
	configs.Load()

	// JWT
	middleware.InitJWT(configs.JWTSecret)

	// User-services gRPC client
	userRPC.Init(configs.UserServiceAddr)

	r := gin.Default()

	// CORS
	r.Use(func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin != "" {
			c.Header("Access-Control-Allow-Origin", origin)
		}
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Header("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	api.RegisterRoutes(r)

	log.Println("[gateway] listening on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
