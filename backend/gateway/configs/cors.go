package configs

import (
	"os"
	"strings"
)

// IsProd returns true when running in production (FRONTEND_URL starts with https).
func IsProd() bool {
	return strings.HasPrefix(os.Getenv("FRONTEND_URL"), "https://")
}
