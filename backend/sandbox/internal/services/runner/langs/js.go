package langs

import (
	"time"

	"github.com/turmwerk/qeedu/backend/sandbox/internal/services/runner"
	"github.com/turmwerk/qeedu/backend/sandbox/internal/services/runtimeimages"
)

type JavaScript struct{}

func (JavaScript) Config() runner.LangConfig {
	return runner.LangConfig{
		Language:    "javascript",
		Image:       runtimeimages.JavaScript,
		Filename:    "main.js",
		RunCmd:      []string{"node", "main.js"},
		Timeout:     10 * time.Second,
		MemoryLimit: 256 << 20,
	}
}
