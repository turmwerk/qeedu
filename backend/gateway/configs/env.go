package configs

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"golang.org/x/oauth2/google"
)

var (
	GitHubOAuth    *oauth2.Config
	GoogleOAuth    *oauth2.Config
	FrontendURL    string
	DatabaseDSN    string
	JWTSecret      string
	UserServiceAddr      string
	SandboxServiceAddr   string
	AIChatServiceAddr    string
	AICopilotServiceAddr string
)

// Load reads .env (if present) and populates config variables.
func Load() {
	if err := godotenv.Load(); err != nil {
		log.Println("[config] no .env file, reading environment variables directly")
	}

	GitHubOAuth = &oauth2.Config{
		ClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GITHUB_CALLBACK_URL"),
		Scopes:       []string{"user:email"},
		Endpoint:     github.Endpoint,
	}

	GoogleOAuth = &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GOOGLE_CALLBACK_URL"),
		Scopes:       []string{"openid", "email", "profile"},
		Endpoint:     google.Endpoint,
	}

	FrontendURL = os.Getenv("FRONTEND_URL")
	if FrontendURL == "" {
		FrontendURL = "http://localhost:5173"
	}

	DatabaseDSN = os.Getenv("DATABASE_DSN")
	JWTSecret = os.Getenv("JWT_SECRET")
	if JWTSecret == "" {
		JWTSecret = "dev-secret-change-in-production"
	}

	UserServiceAddr = os.Getenv("USER_SERVICE_ADDR")
	if UserServiceAddr == "" {
		UserServiceAddr = "localhost:50051"
	}

	SandboxServiceAddr = os.Getenv("SANDBOX_SERVICE_ADDR")
	if SandboxServiceAddr == "" {
		SandboxServiceAddr = "localhost:50052"
	}

	AICopilotServiceAddr = os.Getenv("AI_COPILOT_SERVICE_ADDR")
	if AICopilotServiceAddr == "" {
		AICopilotServiceAddr = "localhost:50053"
	}

	AIChatServiceAddr = os.Getenv("AI_CHAT_SERVICE_ADDR")
	if AIChatServiceAddr == "" {
		AIChatServiceAddr = "localhost:50054"
	}
}
