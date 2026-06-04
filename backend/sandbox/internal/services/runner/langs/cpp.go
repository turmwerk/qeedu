package langs

import (
	"time"

	"github.com/turmwerk/qeedu/backend/sandbox/internal/services/runner"
	"github.com/turmwerk/qeedu/backend/sandbox/internal/services/runtimeimages"
)

type Cpp struct{}

func (Cpp) Config() runner.LangConfig {
	return runner.LangConfig{
		Language:    "cpp",
		Image:       runtimeimages.Cpp,
		Filename:    "main.cpp",
		CompileCmd:  []string{"g++", "-o", "main", "main.cpp", "-lm"},
		RunCmd:      []string{"./main"},
		Timeout:     15 * time.Second,
		MemoryLimit: 256 << 20,
	}
}
