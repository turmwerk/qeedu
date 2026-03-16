package langs

import (
	"time"

	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runner"
)

type CSharp struct{}

func (CSharp) Config() runner.LangConfig {
	return runner.LangConfig{
		Language:   "csharp",
		Image:      "mcr.microsoft.com/dotnet/sdk:9.0",
		Filename:   "Program.cs",
		RunCmd:     []string{"dotnet-script", "Program.cs"},
		Timeout:    20 * time.Second,
		MemoryLimit: 512 << 20,
	}
}
