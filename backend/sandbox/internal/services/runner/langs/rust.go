package langs

import (
	"time"

	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runner"
)

type Rust struct{}

func (Rust) Config() runner.LangConfig {
	return runner.LangConfig{
		Language:    "rust",
		Image:       "rust:1.83-slim",
		Filename:    "main.rs",
		CompileCmd:  []string{"rustc", "-o", "main", "main.rs"},
		RunCmd:      []string{"./main"},
		Timeout:     20 * time.Second,
		MemoryLimit: 512 << 20,
	}
}
