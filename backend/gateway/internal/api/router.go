package api

import (
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/api/v1/ai"
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/api/v1/auth"
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/api/v1/auth/oauth"
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/api/v1/sandbox"
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/middleware"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	// 基础探针 (K8s / Docker / Nginx health check)
	r.GET("/", func(c *gin.Context) { c.String(200, "OK") })
	r.HEAD("/", func(c *gin.Context) { c.Status(200) })
	r.GET("/health", func(c *gin.Context) { c.String(200, "OK") })
	r.HEAD("/health", func(c *gin.Context) { c.Status(200) })
	r.GET("/ready", func(c *gin.Context) { c.String(200, "Ready") })
	r.HEAD("/ready", func(c *gin.Context) { c.Status(200) })
	registerDocsRoutes(r)

	// 业务 API
	v1 := r.Group("/api/v1")
	{
		authGroup := v1.Group("/auth")
		{
			// 统一登录入口
			authGroup.POST("/login", auth.Login)

			// OAuth 回调路由
			authGroup.GET("/github", oauth.GitHubLogin)
			authGroup.GET("/github/callback", oauth.GitHubCallback)
			authGroup.GET("/google", oauth.GoogleLogin)
			authGroup.GET("/google/callback", oauth.GoogleCallback)
		}

		// 需要登录的路由
		protected := v1.Group("")
		protected.Use(middleware.AuthRequired())
		{
			protected.GET("/me", auth.Me)

			// Sandbox
			protected.POST("/sandbox/run", sandbox.RunCode)
			protected.POST("/sandbox/exec", sandbox.ExecCommand)
			protected.GET("/sandbox/terminal/ws", sandbox.TerminalWS)
			protected.POST("/sandbox/lsp/session", sandbox.EnsureLSPSession)
			protected.PATCH("/sandbox/lsp/session/:sessionId/file", sandbox.SyncLSPFile)
			protected.GET("/sandbox/lsp/session/:sessionId/diagnostics", sandbox.GetLSPDiagnostics)
			protected.POST("/sandbox/lsp/session/:sessionId/completion", sandbox.GetLSPCompletions)
			protected.DELETE("/sandbox/lsp/session/:sessionId", sandbox.DestroyLSPSession)

			// AI
			protected.POST("/ai/chat", ai.Chat)
			protected.POST("/ai/complete", ai.Complete)
			protected.POST("/ai/fix", ai.FixBug)
			protected.GET("/ai/models", ai.ListModels)
		}
	}
}
