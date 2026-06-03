package oauth

import (
	"crypto/rand"
	"encoding/base64"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/configs"
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/api/v1/account"
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/middleware"
	userRPC "github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/rpc/user"
	userv1 "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/pb/user/v1"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
)

const oauthStateCookieName = "edu_oauth_state"

func randomState() string {
	b := make([]byte, 16)
	rand.Read(b)
	return base64.URLEncoding.EncodeToString(b)
}

func currentUserID(c *gin.Context) uint {
	token := ""
	if tok, err := c.Cookie("edu_token"); err == nil && tok != "" {
		token = tok
	}
	if token == "" {
		return 0
	}
	claims, err := middleware.ParseToken(token)
	if err != nil {
		return 0
	}
	if uid, ok := claims["user_id"].(float64); ok && uid > 0 {
		return uint(uid)
	}
	return 0
}

func isBindMode(c *gin.Context) bool {
	return strings.EqualFold(strings.TrimSpace(c.Query("mode")), "bind")
}

func oauthState(c *gin.Context) string {
	state := randomState()
	if isBindMode(c) {
		state = "bind:" + state
	}
	c.SetCookie(
		oauthStateCookieName,
		state,
		int((10 * time.Minute).Seconds()),
		"/",
		"",
		configs.IsProd(),
		true,
	)
	return state
}

func callbackBindMode(c *gin.Context) bool {
	return strings.HasPrefix(strings.TrimSpace(c.Query("state")), "bind:")
}

func verifyOAuthState(c *gin.Context) bool {
	state := strings.TrimSpace(c.Query("state"))
	cookieState, err := c.Cookie(oauthStateCookieName)
	c.SetCookie(oauthStateCookieName, "", -1, "/", "", configs.IsProd(), true)
	if err != nil || state == "" || cookieState == "" || state != cookieState {
		oauthError(c, "OAuth state 校验失败")
		return false
	}
	return true
}

func redirectToFrontend(c *gin.Context, params url.Values) {
	c.Redirect(http.StatusTemporaryRedirect, configs.FrontendURL+"/login?"+params.Encode())
}

func oauthError(c *gin.Context, msg string) {
	redirectToFrontend(c, url.Values{"oauth_error": {msg}})
}

func ensureOAuthConfig(c *gin.Context, providerLabel string, cfg *oauth2.Config, envPrefix string) bool {
	if cfg == nil {
		log.Printf("[oauth] %s config is nil", providerLabel)
		oauthError(c, providerLabel+" OAuth 未配置")
		return false
	}

	var missing []string
	if strings.TrimSpace(cfg.ClientID) == "" {
		missing = append(missing, envPrefix+"_CLIENT_ID")
	}
	if strings.TrimSpace(cfg.ClientSecret) == "" {
		missing = append(missing, envPrefix+"_CLIENT_SECRET")
	}
	if strings.TrimSpace(cfg.RedirectURL) == "" {
		missing = append(missing, envPrefix+"_CALLBACK_URL")
	}

	if len(missing) > 0 {
		log.Printf("[oauth] %s config missing: %s", providerLabel, strings.Join(missing, ", "))
		oauthError(c, providerLabel+" OAuth 未配置")
		return false
	}

	return true
}

// FinishOAuth upserts the user via gRPC, generates a JWT, sets an httpOnly cookie,
// and redirects to the frontend.
func FinishOAuth(c *gin.Context, profile *userv1.OAuthProfile) {
	if callbackBindMode(c) {
		uid := currentUserID(c)
		if uid == 0 {
			redirectToFrontend(c, url.Values{"oauth_error": {"请先登录后再绑定第三方账号"}})
			return
		}
		if err := account.LinkOAuthIdentity(uid, account.OAuthIdentityInput{
			Provider:       profile.Provider,
			ProviderUserID: profile.ProviderId,
			ProviderEmail:  profile.Email,
			ProviderName:   profile.Name,
			AvatarURL:      profile.AvatarUrl,
		}); err != nil {
			redirectToFrontend(c, url.Values{"oauth_error": {"绑定失败: " + err.Error()}})
			return
		}
		c.Redirect(http.StatusTemporaryRedirect, configs.FrontendURL+"/account/sign-in?oauth_bound="+url.QueryEscape(profile.Provider))
		return
	}

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

	// Set httpOnly cookie on the API domain (works cross-origin with credentials:include).
	c.SetCookie(
		"edu_token",                         // name
		token,                               // value
		int((7 * 24 * time.Hour).Seconds()), // max age (7 days)
		"/",                                 // path
		"",                                  // domain (current host only: api.qeedu.tech)
		configs.IsProd(),                    // secure (HTTPS only in production)
		true,                                // httpOnly
	)

	redirectToFrontend(c, url.Values{
		"oauth_provider": {profile.Provider},
		"oauth_name":     {u.Name},
	})
}
