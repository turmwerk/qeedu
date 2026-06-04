package langs

import (
	"time"

	"github.com/turmwerk/qeedu/backend/sandbox/internal/services/runner"
	"github.com/turmwerk/qeedu/backend/sandbox/internal/services/runtimeimages"
)

type CSharp struct{}

func (CSharp) Config() runner.LangConfig {
	return runner.LangConfig{
		Language: "csharp",
		Image:    runtimeimages.CSharp,
		Filename: "Program.cs",
		Files: map[string]string{
			"Runner.csproj": `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net9.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>
`,
		},
		RunCmd:      []string{"dotnet", "run", "--project", "Runner.csproj"},
		Timeout:     20 * time.Second,
		MemoryLimit: 512 << 20,
	}
}
