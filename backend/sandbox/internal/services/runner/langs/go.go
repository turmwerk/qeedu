package langs

import (
	"time"

	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runner"
	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runtimeimages"
)

type Go struct{}

func (Go) Config() runner.LangConfig {
	return runner.LangConfig{
		Language:    "go",
		Image:       runtimeimages.Go,
		Filename:    "main.go",
		CompileCmd:  []string{"go", "build", "-trimpath", "-buildvcs=false", "-o", "main", "main.go"},
		RunCmd:      []string{"./main"},
		Timeout:     20 * time.Second,
		MemoryLimit: 512 << 20,
	}
}
