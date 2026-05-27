package api

import (
	"bytes"
	"html/template"
	"net/http"

	"github.com/gin-gonic/gin"
)

type apiDocRoute struct {
	Method      string
	Path        string
	Description string
	Auth        string
}

type apiDocSection struct {
	Title  string
	Routes []apiDocRoute
}

func registerDocsRoutes(r *gin.Engine) {
	r.GET("/docs", func(c *gin.Context) {
		c.Data(http.StatusOK, "text/html; charset=utf-8", []byte(docsHTML))
	})
	r.HEAD("/docs", func(c *gin.Context) { c.Status(http.StatusOK) })
}

var docsSections = []apiDocSection{
	{
		Title: "Public",
		Routes: []apiDocRoute{
			{Method: "GET", Path: "/", Description: "Service root probe", Auth: "No"},
			{Method: "GET", Path: "/health", Description: "Health probe", Auth: "No"},
			{Method: "GET", Path: "/ready", Description: "Readiness probe", Auth: "No"},
			{Method: "GET", Path: "/docs", Description: "API link page", Auth: "No"},
		},
	},
	{
		Title: "Auth",
		Routes: []apiDocRoute{
			{Method: "POST", Path: "/api/v1/auth/login", Description: "Password login", Auth: "No"},
			{Method: "GET", Path: "/api/v1/auth/github", Description: "Start GitHub OAuth login", Auth: "No"},
			{Method: "GET", Path: "/api/v1/auth/github/callback", Description: "GitHub OAuth callback", Auth: "No"},
			{Method: "GET", Path: "/api/v1/auth/google", Description: "Start Google OAuth login", Auth: "No"},
			{Method: "GET", Path: "/api/v1/auth/google/callback", Description: "Google OAuth callback", Auth: "No"},
		},
	},
	{
		Title: "User",
		Routes: []apiDocRoute{
			{Method: "GET", Path: "/api/v1/me", Description: "Current user profile", Auth: "Bearer token"},
		},
	},
	{
		Title: "Sandbox",
		Routes: []apiDocRoute{
			{Method: "POST", Path: "/api/v1/sandbox/run", Description: "Run source code", Auth: "Bearer token"},
			{Method: "POST", Path: "/api/v1/sandbox/exec", Description: "Execute terminal command", Auth: "Bearer token"},
			{Method: "GET", Path: "/api/v1/sandbox/terminal/ws", Description: "Terminal WebSocket", Auth: "Bearer token"},
			{Method: "POST", Path: "/api/v1/sandbox/lsp/session", Description: "Create or reuse LSP session", Auth: "Bearer token"},
			{Method: "PATCH", Path: "/api/v1/sandbox/lsp/session/:sessionId/file", Description: "Sync LSP file content", Auth: "Bearer token"},
			{Method: "GET", Path: "/api/v1/sandbox/lsp/session/:sessionId/diagnostics", Description: "Get LSP diagnostics", Auth: "Bearer token"},
			{Method: "POST", Path: "/api/v1/sandbox/lsp/session/:sessionId/completion", Description: "Get LSP completions", Auth: "Bearer token"},
			{Method: "DELETE", Path: "/api/v1/sandbox/lsp/session/:sessionId", Description: "Destroy LSP session", Auth: "Bearer token"},
		},
	},
	{
		Title: "AI",
		Routes: []apiDocRoute{
			{Method: "POST", Path: "/api/v1/ai/chat", Description: "Streaming AI chat", Auth: "Bearer token"},
			{Method: "POST", Path: "/api/v1/ai/complete", Description: "Code completion", Auth: "Bearer token"},
			{Method: "POST", Path: "/api/v1/ai/fix", Description: "Bug fix assistant", Auth: "Bearer token"},
		},
	},
}

var docsHTML = buildDocsHTML()

func buildDocsHTML() string {
	const page = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Backend API Docs</title>
  <style>
    :root { color-scheme: light; --border: #d8dee8; --text: #172033; --muted: #637083; --bg: #f7f9fc; --panel: #fff; --code: #eef3f9; --accent: #0969da; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--text); background: var(--bg); }
    main { max-width: 1180px; margin: 0 auto; padding: 28px 20px 48px; }
    h1 { margin: 0 0 6px; font-size: 28px; font-weight: 700; }
    p { margin: 0 0 22px; color: var(--muted); }
    section { margin-top: 20px; background: var(--panel); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
    h2 { margin: 0; padding: 14px 16px; font-size: 16px; border-bottom: 1px solid var(--border); background: #fbfcfe; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 11px 16px; text-align: left; border-bottom: 1px solid var(--border); vertical-align: top; }
    tr:last-child td { border-bottom: 0; }
    th { font-size: 12px; text-transform: uppercase; letter-spacing: .04em; color: var(--muted); background: #fbfcfe; }
    code { display: inline-block; padding: 3px 6px; border-radius: 5px; background: var(--code); font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    .method { width: 92px; font-weight: 700; }
    .auth { width: 140px; color: var(--muted); }
    @media (max-width: 720px) {
      main { padding: 20px 12px 36px; }
      th:nth-child(4), td:nth-child(4) { display: none; }
      th, td { padding: 10px 8px; }
      .method { width: 64px; }
    }
  </style>
</head>
<body>
<main>
  <h1>Backend API Docs</h1>
  <p>当前网关已注册的 API 链接。需要登录的接口请带 <code>Authorization: Bearer &lt;token&gt;</code>。</p>
  {{range .}}
  <section>
    <h2>{{.Title}}</h2>
    <table>
      <thead><tr><th>Method</th><th>Path</th><th>Description</th><th>Auth</th></tr></thead>
      <tbody>
      {{range .Routes}}
        <tr>
          <td class="method"><code>{{.Method}}</code></td>
          <td><code>{{if eq .Method "GET"}}<a href="{{.Path}}">{{.Path}}</a>{{else}}{{.Path}}{{end}}</code></td>
          <td>{{.Description}}</td>
          <td class="auth">{{.Auth}}</td>
        </tr>
      {{end}}
      </tbody>
    </table>
  </section>
	{{end}}
</main>
</body>
</html>`
	tpl := template.Must(template.New("docs").Parse(page))
	var out bytes.Buffer
	if err := tpl.Execute(&out, docsSections); err != nil {
		return "failed to render docs"
	}
	return out.String()
}
