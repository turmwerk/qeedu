package langs

import (
	"time"

	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runner"
)

type Go struct{}

func (Go) Config() runner.LangConfig {
	return runner.LangConfig{
		Language:    "go",
		Image:       "golang:1.23-alpine",
		Filename:    "main.go",
		CompileCmd:  []string{"go", "build", "-o", "main", "main.go"},
		RunCmd:      []string{"./main"},
		Timeout:     20 * time.Second,
		MemoryLimit: 512 << 20,
	}
}
