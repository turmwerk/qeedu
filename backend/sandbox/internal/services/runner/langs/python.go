package langs

import (
	"time"

	"github.com/turmwerk/qeedu/backend/sandbox/internal/services/runner"
	"github.com/turmwerk/qeedu/backend/sandbox/internal/services/runtimeimages"
)

type Python struct{}

func (Python) Config() runner.LangConfig {
	return runner.LangConfig{
		Language:    "python",
		Image:       runtimeimages.Python,
		Filename:    "main.py",
		RunCmd:      []string{"python3", "main.py"},
		Timeout:     10 * time.Second,
		MemoryLimit: 256 << 20,
	}
}
