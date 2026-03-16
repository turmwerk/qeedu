package langs

import (
	"time"

	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runner"
)

type Cpp struct{}

func (Cpp) Config() runner.LangConfig {
	return runner.LangConfig{
		Language:    "cpp",
		Image:       "gcc:14",
		Filename:    "main.cpp",
		CompileCmd:  []string{"g++", "-o", "main", "main.cpp", "-lm"},
		RunCmd:      []string{"./main"},
		Timeout:     15 * time.Second,
		MemoryLimit: 256 << 20,
	}
}
