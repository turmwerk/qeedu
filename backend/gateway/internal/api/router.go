// gateway/internal/api/router.go
package api

func RegisterRoutes(r *gin.Engine) {
    // 基础探针 (供 K8s, Docker, Nginx 检查，不需要写在 v1 里面)
    r.GET("/health", func(c *gin.Context) {
        c.String(200, "OK")
    })
    
    r.GET("/ready", func(c *gin.Context) {
        // 比如在这里检查一下 MySQL 和 Redis 是否连接正常
        // if db.Ping() == nil { c.String(200, "Ready") }
        c.String(200, "Ready")
    })

    // 业务 API
    v1 := r.Group("/api/v1")
    {
        v1.POST("/auth/login", )
    }
}