package runner

import (
	"context"
	"io"
	"strings"
	"time"

	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/container"
)

// Manager orchestrates code execution using the container client.
type Manager struct {
	docker *container.Client
}

// NewManager creates a runner manager.
func NewManager(docker *container.Client) *Manager {
	return &Manager{docker: docker}
}

// Run executes the given code in a sandboxed container.
func (m *Manager) Run(ctx context.Context, req RunRequest) (*RunResult, error) {
	if strings.TrimSpace(req.Code) == "" {
		return nil, ErrCodeEmpty
	}

	r, err := Get(req.Language)
	if err != nil {
		return nil, err
	}

	cfg := r.Config()

	timeout := cfg.Timeout
	if req.Timeout > 0 && req.Timeout <= 30*time.Second {
		timeout = req.Timeout
	}

	// Build the full command
	var cmd []string
	if len(cfg.CompileCmd) > 0 {
		compile := strings.Join(cfg.CompileCmd, " ")
		run := strings.Join(cfg.RunCmd, " ")
		cmd = []string{"sh", "-c", "cd /code && " + compile + " && " + run}
	} else {
		cmd = []string{"sh", "-c", "cd /code && " + strings.Join(cfg.RunCmd, " ")}
	}

	var stdinReader io.Reader
	if req.Stdin != "" {
		stdinReader = strings.NewReader(req.Stdin)
	}

	start := time.Now()

	result, err := m.docker.Run(ctx, container.RunConfig{
		Image:      cfg.Image,
		Cmd:        cmd,
		WorkingDir: "/code",
		Memory:     cfg.MemoryLimit,
		CPUQuota:   100000, // 1 CPU
		Timeout:    timeout,
		Stdin:      stdinReader,
		Files: map[string][]byte{
			cfg.Filename: []byte(req.Code),
		},
	})
	if err != nil {
		if strings.Contains(err.Error(), "timed out") {
			return nil, ErrTimeout
		}
		return nil, err
	}

	elapsed := time.Since(start).Milliseconds()

	return &RunResult{
		Stdout:      result.Stdout,
		Stderr:      result.Stderr,
		ExitCode:    result.ExitCode,
		ExecutionMs: elapsed,
	}, nil
}
