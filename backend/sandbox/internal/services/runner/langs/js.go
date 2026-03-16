package langs

import (
	"time"

	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runner"
)

type JavaScript struct{}

func (JavaScript) Config() runner.LangConfig {
	return runner.LangConfig{
		Language:    "javascript",
		Image:       "node:22-slim",
		Filename:    "main.js",
		RunCmd:      []string{"node", "main.js"},
		Timeout:     10 * time.Second,
		MemoryLimit: 256 << 20,
	}
}
