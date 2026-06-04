package main

import (
	"context"
	"log"
	"os"

	"github.com/joho/godotenv"

	"github.com/turmwerk/qeedu/backend/sandbox/internal/rpc"
	"github.com/turmwerk/qeedu/backend/sandbox/internal/services/container"
	"github.com/turmwerk/qeedu/backend/sandbox/internal/services/lsp"
	"github.com/turmwerk/qeedu/backend/sandbox/internal/services/runner"
	"github.com/turmwerk/qeedu/backend/sandbox/internal/services/runner/langs"
	"github.com/turmwerk/qeedu/backend/sandbox/internal/services/runtimeimages"
	"github.com/turmwerk/qeedu/backend/sandbox/internal/services/terminal"
)

func main() {
	_ = godotenv.Load()

	// Docker client
	dockerClient, err := container.NewClient()
	if err != nil {
		log.Fatalf("[sandbox] failed to create docker client: %v", err)
	}
	defer dockerClient.Close()

	// Register language runners
	runner.Register(langs.Python{})
	runner.Register(langs.JavaScript{})
	runner.Register(langs.TypeScript{})
	runner.Register(langs.Go{})
	runner.Register(langs.Java{})
	runner.Register(langs.C{})
	runner.Register(langs.Cpp{})
	runner.Register(langs.Rust{})
	runner.Register(langs.CSharp{})

	// Create managers
	runnerMgr := runner.NewManager(dockerClient)
	defer runnerMgr.Shutdown(context.Background())
	terminalMgr := terminal.NewManager(dockerClient)
	lspMgr := lsp.NewManager(dockerClient)
	defer lspMgr.Shutdown(context.Background())

	if err := dockerClient.EnsureRuntimeImages(context.Background(), []string{
		runtimeimages.Python,
		runtimeimages.JavaScript,
		runtimeimages.TypeScript,
		runtimeimages.Go,
		runtimeimages.Java,
		runtimeimages.C,
		runtimeimages.Cpp,
		runtimeimages.Rust,
		runtimeimages.CSharp,
		runtimeimages.TerminalBash,
		runtimeimages.LSPGo,
		runtimeimages.LSPPython,
		runtimeimages.LSPTypeScript,
		runtimeimages.LSPJava,
		runtimeimages.LSPCpp,
		runtimeimages.LSPRust,
		runtimeimages.LSPCSharp,
	}); err != nil {
		log.Fatalf("[sandbox] prepare runtime images: %v", err)
	}

	// Start gRPC server
	addr := os.Getenv("GRPC_ADDR")
	if addr == "" {
		addr = ":50052"
	}

	log.Printf("[sandbox] supported languages: %v", runner.SupportedLanguages())

	if err := rpc.Serve(addr, runnerMgr, terminalMgr, lspMgr); err != nil {
		log.Fatalf("[sandbox] grpc server: %v", err)
	}
}
