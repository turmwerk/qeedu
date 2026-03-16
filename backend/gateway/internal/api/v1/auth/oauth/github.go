package oauth

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	userv1 "github.com/dieWehmut/nju-edu-ai-system/backend/proto/user/v1"
	"github.com/dieWehmut/nju-edu-ai-system/backend/gateway/configs"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
)

type gitHubUser struct {
	ID        int    `json:"id"`
	Login     string `json:"login"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	AvatarURL string `json:"avatar_url"`
}

// GitHubLogin redirects the browser to GitHub's authorization page.
//
//	GET /api/v1/auth/github
func GitHubLogin(c *gin.Context) {
	state := randomState()
	u := configs.GitHubOAuth.AuthCodeURL(state, oauth2.AccessTypeOnline)
	c.Redirect(http.StatusTemporaryRedirect, u)
}

// GitHubCallback handles the OAuth redirect from GitHub.
//
//	GET /api/v1/auth/github/callback?code=xxx&state=xxx
func GitHubCallback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		oauthError(c, "missing code")
		return
	}

	token, err := configs.GitHubOAuth.Exchange(context.Background(), code)
	if err != nil {
		oauthError(c, "token exchange failed: "+err.Error())
		return
	}

	client := configs.GitHubOAuth.Client(context.Background(), token)
	resp, err := client.Get("https://api.github.com/user")
	if err != nil {
		oauthError(c, "failed to fetch GitHub user")
		return
	}
	defer resp.Body.Close()

	var ghUser gitHubUser
	if err := json.NewDecoder(resp.Body).Decode(&ghUser); err != nil {
		oauthError(c, "failed to parse GitHub user")
		return
	}

	name := ghUser.Name
	if name == "" {
		name = ghUser.Login
	}

	FinishOAuth(c, &userv1.OAuthProfile{
		Provider:   "github",
		ProviderId: fmt.Sprintf("%d", ghUser.ID),
		Name:       name,
		Email:      ghUser.Email,
		AvatarUrl:  ghUser.AvatarURL,
	})
}
