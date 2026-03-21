package langs

import (
	"time"

	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runner"
	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runtimeimages"
)

type TypeScript struct{}

func (TypeScript) Config() runner.LangConfig {
	return runner.LangConfig{
		Language:    "typescript",
		Image:       runtimeimages.TypeScript,
		Filename:    "main.ts",
		RunCmd:      []string{"deno", "run", "--allow-all", "main.ts"},
		Timeout:     15 * time.Second,
		MemoryLimit: 256 << 20,
	}
}
