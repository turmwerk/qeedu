package oauth

import (
	"crypto/rand"
	"encoding/base64"
	"net/http"
	"net/url"

	userv1 "github.com/dieWehmut/nju-edu-ai-system/backend/proto/user/v1"
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/configs"
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/middleware"
	userRPC "github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/rpc/user"
	"github.com/gin-gonic/gin"
)

func randomState() string {
	b := make([]byte, 16)
	rand.Read(b)
	return base64.URLEncoding.EncodeToString(b)
}

func redirectToFrontend(c *gin.Context, params url.Values) {
	c.Redirect(http.StatusTemporaryRedirect, configs.FrontendURL+"/login?"+params.Encode())
}

func oauthError(c *gin.Context, msg string) {
	redirectToFrontend(c, url.Values{"oauth_error": {msg}})
}

// FinishOAuth upserts the user via gRPC, generates a JWT, and redirects to the frontend.
func FinishOAuth(c *gin.Context, profile *userv1.OAuthProfile) {
	u, err := userRPC.FindOrCreateOAuthUser(c.Request.Context(), profile)
	if err != nil {
		oauthError(c, "failed to save user: "+err.Error())
		return
	}

	token, err := middleware.GenerateToken(uint(u.Id), u.Name)
	if err != nil {
		oauthError(c, "failed to generate token")
		return
	}

	redirectToFrontend(c, url.Values{
		"oauth_provider": {profile.Provider},
		"oauth_name":     {u.Name},
		"oauth_token":    {token},
	})
}
