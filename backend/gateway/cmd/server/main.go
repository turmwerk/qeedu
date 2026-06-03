package main

import (
	"log"
	"net/http"

	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/configs"
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/api"
	aiAPI "github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/api/v1/ai"
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/middleware"
	aiChatRPC "github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/rpc/ai-chat"
	aiCopilotRPC "github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/rpc/ai-copilot"
	sandboxRPC "github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/rpc/sandbox"
	userRPC "github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/rpc/user"
	db "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/mysql"
	"github.com/gin-gonic/gin"
)

func main() {
	configs.Load()

	// JWT
	middleware.InitJWT(configs.JWTSecret)

	if configs.DatabaseDSN == "" {
		log.Fatal("[gateway] DATABASE_DSN is required")
	}
	db.Init(configs.DatabaseDSN)
	if err := aiAPI.AutoMigrate(); err != nil {
		log.Fatalf("[gateway] failed to migrate ai tables: %v", err)
	}

	// User-services gRPC client
	userRPC.Init(configs.UserServiceAddr)

	// Sandbox gRPC client
	sandboxRPC.Init(configs.SandboxServiceAddr)

	// AI services gRPC clients
	aiCopilotRPC.Init(configs.AICopilotServiceAddr)
	aiChatRPC.Init(configs.AIChatServiceAddr)

	r := gin.Default()

	// CORS
	r.Use(func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin != "" {
			c.Header("Access-Control-Allow-Origin", origin)
		}
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Header("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	api.RegisterRoutes(r)
	r.Static("/uploads", "./uploads")

	log.Println("[gateway] listening on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
