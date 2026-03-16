package langs

import (
	"time"

	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runner"
)

type Java struct{}

func (Java) Config() runner.LangConfig {
	return runner.LangConfig{
		Language:    "java",
		Image:       "eclipse-temurin:21-jdk-alpine",
		Filename:    "Main.java",
		CompileCmd:  []string{"javac", "Main.java"},
		RunCmd:      []string{"java", "Main"},
		Timeout:     20 * time.Second,
		MemoryLimit: 512 << 20,
	}
}
