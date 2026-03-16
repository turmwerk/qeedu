package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"

	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/rpc"
	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/container"
	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runner"
	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runner/langs"
	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/terminal"
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
	terminalMgr := terminal.NewManager(dockerClient)

	// Start gRPC server
	addr := os.Getenv("GRPC_ADDR")
	if addr == "" {
		addr = ":50052"
	}

	log.Printf("[sandbox] supported languages: %v", runner.SupportedLanguages())

	if err := rpc.Serve(addr, runnerMgr, terminalMgr); err != nil {
		log.Fatalf("[sandbox] grpc server: %v", err)
	}
}
