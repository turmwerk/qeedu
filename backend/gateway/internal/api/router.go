package api

import (
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/api/v1/account"
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/api/v1/ai"
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/api/v1/auth"
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/api/v1/auth/oauth"
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/api/v1/feature"
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
			authGroup.POST("/send-code", auth.SendCode)
			authGroup.POST("/register", auth.Register)
			authGroup.POST("/reset-password", auth.ResetPassword)

			// OAuth 回调路由
			authGroup.GET("/github", oauth.GitHubLogin)
			authGroup.GET("/github/callback", oauth.GitHubCallback)
			authGroup.GET("/google", oauth.GoogleLogin)
			authGroup.GET("/google/callback", oauth.GoogleCallback)
		}

		// 公开 AI 端点（无需登录）
		v1.GET("/ai/models", ai.ListModels)

		// 需要登录的路由
		protected := v1.Group("")
		protected.Use(middleware.AuthRequired())
		{
			protected.GET("/me", auth.Me)
			protected.POST("/auth/refresh", auth.Refresh)
			protected.POST("/auth/logout", auth.Logout)

			accountGroup := protected.Group("/account")
			{
				accountGroup.GET("/overview", account.Overview)
				accountGroup.GET("/profile", account.GetProfile)
				accountGroup.PATCH("/profile", account.UpdateProfile)
				accountGroup.PATCH("/email", account.UpdateEmail)
				accountGroup.PATCH("/password", account.ChangePassword)
				accountGroup.GET("/preferences", account.GetPreferences)
				accountGroup.PATCH("/preferences", account.UpdatePreferences)
				accountGroup.GET("/identities", account.GetIdentities)
				accountGroup.DELETE("/identities/:provider", account.UnlinkIdentity)
				accountGroup.GET("/events", account.Events)
				accountGroup.POST("/feedback", account.Feedback)
				accountGroup.DELETE("", account.DeleteAccount)
			}

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

			// Feature workspaces
			registerFeatureRoutes(protected, "teaching")
			registerFeatureRoutes(protected, "management")
			registerFeatureRoutes(protected, "research")
			registerFeatureRoutes(protected, "international")
		}
	}
}

func registerFeatureRoutes(group *gin.RouterGroup, domain string) {
	base := "/" + domain + "/:feature"
	withDomain := func(handler gin.HandlerFunc) gin.HandlerFunc {
		return func(c *gin.Context) {
			c.Set("feature_domain", domain)
			handler(c)
		}
	}
	group.GET(base+"/page-data", withDomain(feature.PageData))
	group.GET(base+"/:resource", withDomain(feature.List))
	group.POST(base+"/:resource", withDomain(feature.Create))
	group.GET(base+"/:resource/:id", withDomain(feature.Detail))
	group.PATCH(base+"/:resource/:id", withDomain(feature.Update))
	group.DELETE(base+"/:resource/:id", withDomain(feature.Remove))
	group.GET(base+"/:resource/:id/messages", withDomain(feature.Messages))
	group.POST(base+"/:resource/:id/chat", withDomain(feature.Chat))
}
