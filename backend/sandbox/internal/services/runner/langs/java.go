package langs

import (
	"time"

	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runner"
	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runtimeimages"
)

type Java struct{}

func (Java) Config() runner.LangConfig {
	return runner.LangConfig{
		Language:    "java",
		Image:       runtimeimages.Java,
		Filename:    "Main.java",
		CompileCmd:  []string{"javac", "Main.java"},
		RunCmd:      []string{"java", "Main"},
		Timeout:     20 * time.Second,
		MemoryLimit: 512 << 20,
	}
}
