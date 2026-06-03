package oauth

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/configs"
	userv1 "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/pb/user/v1"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
)

type microsoftUser struct {
	ID                string `json:"id"`
	DisplayName       string `json:"displayName"`
	Mail              string `json:"mail"`
	UserPrincipalName string `json:"userPrincipalName"`
}

// MicrosoftLogin redirects the browser to Microsoft's authorization page.
//
//	GET /api/v1/auth/microsoft
func MicrosoftLogin(c *gin.Context) {
	if !ensureOAuthConfig(c, "Microsoft", configs.MicrosoftOAuth, "MICROSOFT") {
		return
	}
	state := oauthState(c)
	u := configs.MicrosoftOAuth.AuthCodeURL(state, oauth2.AccessTypeOffline)
	c.Redirect(http.StatusTemporaryRedirect, u)
}

// MicrosoftCallback handles the OAuth redirect from Microsoft.
//
//	GET /api/v1/auth/microsoft/callback?code=xxx&state=xxx
func MicrosoftCallback(c *gin.Context) {
	if !ensureOAuthConfig(c, "Microsoft", configs.MicrosoftOAuth, "MICROSOFT") {
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

	token, err := configs.MicrosoftOAuth.Exchange(context.Background(), code)
	if err != nil {
		oauthError(c, "token exchange failed: "+err.Error())
		return
	}

	client := configs.MicrosoftOAuth.Client(context.Background(), token)
	resp, err := client.Get("https://graph.microsoft.com/v1.0/me?$select=id,displayName,mail,userPrincipalName")
	if err != nil {
		oauthError(c, "failed to fetch Microsoft user")
		return
	}
	defer resp.Body.Close()
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		oauthError(c, "failed to fetch Microsoft user")
		return
	}

	var msUser microsoftUser
	if err := json.NewDecoder(resp.Body).Decode(&msUser); err != nil {
		oauthError(c, "failed to parse Microsoft user")
		return
	}

	email := msUser.Mail
	if email == "" {
		email = msUser.UserPrincipalName
	}

	FinishOAuth(c, &userv1.OAuthProfile{
		Provider:   "microsoft",
		ProviderId: msUser.ID,
		Name:       msUser.DisplayName,
		Email:      email,
	})
}
