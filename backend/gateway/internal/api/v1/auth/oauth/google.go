package oauth

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/turmwerk/qeedu/backend/gateway/configs"
	userv1 "github.com/turmwerk/qeedu/backend/pkg/pb/user/v1"
	"golang.org/x/oauth2"
)

type googleUser struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	VerifiedEmail bool   `json:"verified_email"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
}

// GoogleLogin redirects the browser to Google's authorization page.
//
//	GET /api/v1/auth/google
func GoogleLogin(c *gin.Context) {
	if !ensureOAuthConfig(c, "Google", configs.GoogleOAuth, "GOOGLE") {
		return
	}
	state := oauthState(c)
	u := configs.GoogleOAuth.AuthCodeURL(state, oauth2.AccessTypeOffline, oauth2.ApprovalForce)
	c.Redirect(http.StatusTemporaryRedirect, u)
}

// GoogleCallback handles the OAuth redirect from Google.
//
//	GET /api/v1/auth/google/callback?code=xxx&state=xxx
func GoogleCallback(c *gin.Context) {
	if !ensureOAuthConfig(c, "Google", configs.GoogleOAuth, "GOOGLE") {
		return
	}
	if !verifyOAuthState(c) {
		return
	}
	code := c.Query("code")
	if code == "" {
		oauthError(c, "missing code")
		return
	}

	token, err := configs.GoogleOAuth.Exchange(context.Background(), code)
	if err != nil {
		oauthError(c, "token exchange failed: "+err.Error())
		return
	}

	client := configs.GoogleOAuth.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		oauthError(c, "failed to fetch Google user")
		return
	}
	defer resp.Body.Close()

	var gUser googleUser
	if err := json.NewDecoder(resp.Body).Decode(&gUser); err != nil {
		oauthError(c, "failed to parse Google user")
		return
	}

	FinishOAuth(c, &userv1.OAuthProfile{
		Provider:   "google",
		ProviderId: gUser.ID,
		Name:       gUser.Name,
		Email:      gUser.Email,
		AvatarUrl:  gUser.Picture,
	})
}
