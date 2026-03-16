package langs

import (
	"time"

	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runner"
)

type C struct{}

func (C) Config() runner.LangConfig {
	return runner.LangConfig{
		Language:    "c",
		Image:       "gcc:14",
		Filename:    "main.c",
		CompileCmd:  []string{"gcc", "-o", "main", "main.c", "-lm"},
		RunCmd:      []string{"./main"},
		Timeout:     15 * time.Second,
		MemoryLimit: 256 << 20,
	}
}
