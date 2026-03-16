package langs

import (
	"time"

	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runner"
)

type Python struct{}

func (Python) Config() runner.LangConfig {
	return runner.LangConfig{
		Language:    "python",
		Image:       "python:3.12-slim",
		Filename:    "main.py",
		RunCmd:      []string{"python3", "main.py"},
		Timeout:     10 * time.Second,
		MemoryLimit: 256 << 20,
	}
}
