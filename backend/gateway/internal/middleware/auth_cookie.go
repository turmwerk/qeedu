package middleware

import "github.com/gin-gonic/gin"

const AuthCookieName = "qeedu_token"
const legacyAuthCookieName = "edu_token"

func ReadAuthCookie(c *gin.Context) string {
	if tok, err := c.Cookie(AuthCookieName); err == nil && tok != "" {
		return tok
	}
	if tok, err := c.Cookie(legacyAuthCookieName); err == nil && tok != "" {
		return tok
	}
	return ""
}

func ClearAuthCookies(c *gin.Context, secure bool) {
	c.SetCookie(AuthCookieName, "", -1, "/", "", secure, true)
	c.SetCookie(legacyAuthCookieName, "", -1, "/", "", secure, true)
}
