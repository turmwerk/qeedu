package runner

import (
	"context"
	"io"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"

	"github.com/turmwerk/qeedu/backend/sandbox/internal/services/container"
)

// Manager orchestrates code execution using the container client.
type Manager struct {
	docker   *container.Client
	mu       sync.RWMutex
	sessions map[string]*session
}

// NewManager creates a runner manager.
func NewManager(docker *container.Client) *Manager {
	m := &Manager{
		docker:   docker,
		sessions: make(map[string]*session),
	}
	go m.reapLoop()
	return m
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

	start := time.Now()

	var result *container.RunResult
	if req.OwnerID > 0 && strings.TrimSpace(req.WorkspaceKey) != "" {
		result, err = m.runWithSession(ctx, req, cfg, timeout)
	} else {
		result, err = m.runFresh(ctx, req, cfg, timeout)
	}
	if err != nil {
		if strings.Contains(err.Error(), "timed out") {
			return nil, ErrTimeout
		}
		return nil, err
	}

	return &RunResult{
		Stdout:      result.Stdout,
		Stderr:      result.Stderr,
		ExitCode:    result.ExitCode,
		ExecutionMs: time.Since(start).Milliseconds(),
	}, nil
}

func (m *Manager) runFresh(ctx context.Context, req RunRequest, cfg LangConfig, timeout time.Duration) (*container.RunResult, error) {
	var stdinReader io.Reader
	if req.Stdin != "" {
		stdinReader = strings.NewReader(req.Stdin)
	}

	compileCmd, runCmd := buildRunCommands(cfg, req)
	cmd := runCmd
	if len(compileCmd) > 0 {
		cmd = []string{"sh", "-c", "cd /code && " + shellJoin(compileCmd) + " && " + shellJoin(runCmd)}
	}

	return m.docker.Run(ctx, container.RunConfig{
		Image:      cfg.Image,
		Cmd:        cmd,
		WorkingDir: "/code",
		Memory:     cfg.MemoryLimit,
		CPUQuota:   defaultCPUQuota,
		Timeout:    timeout,
		Stdin:      stdinReader,
		Files:      buildRequestRunFiles("", cfg, req),
	})
}

func (m *Manager) runWithSession(ctx context.Context, req RunRequest, cfg LangConfig, timeout time.Duration) (*container.RunResult, error) {
	key := sessionKey(req.OwnerID, req.WorkspaceKey, cfg.Language)

	for attempt := 0; attempt < 2; attempt++ {
		sess, err := m.ensureSession(ctx, key, req.OwnerID, req.WorkspaceKey, cfg)
		if err != nil {
			return nil, err
		}

		result, err := m.executeInSession(ctx, sess, cfg, req, timeout)
		if err == nil {
			if result != nil && shouldRecreateSessionForMissingTool(result, cfg) && attempt == 0 {
				m.discardSession(key, sess)
				continue
			}
			return result, nil
		}

		m.discardSession(key, sess)
		if strings.Contains(err.Error(), "timed out") || attempt == 1 {
			return nil, err
		}
	}

	return nil, ErrContainerFailed
}

func shouldRecreateSessionForMissingTool(result *container.RunResult, cfg LangConfig) bool {
	if result.ExitCode != 127 {
		return false
	}
	output := strings.ToLower(result.Stderr + "\n" + result.Stdout)
	for _, cmd := range append(cfg.CompileCmd, cfg.RunCmd...) {
		if cmd == "" || strings.Contains(cmd, "/") || strings.HasPrefix(cmd, ".") {
			continue
		}
		if strings.Contains(output, cmd+": not found") ||
			strings.Contains(output, cmd+": command not found") ||
			strings.Contains(output, cmd+" not found") {
			return true
		}
	}
	return false
}

func (m *Manager) ensureSession(
	ctx context.Context,
	key string,
	ownerID uint64,
	workspaceKey string,
	cfg LangConfig,
) (*session, error) {
	m.mu.RLock()
	existing := m.sessions[key]
	m.mu.RUnlock()
	if existing != nil {
		existing.touch()
		return existing, nil
	}

	containerID, err := m.docker.CreatePersistent(ctx, container.PersistentContainerConfig{
		Image:      cfg.Image,
		Cmd:        keepAliveCmd,
		WorkingDir: runnerBaseDir,
		Memory:     cfg.MemoryLimit,
		CPUQuota:   defaultCPUQuota,
	})
	if err != nil {
		return nil, err
	}

	created := &session{
		OwnerID:      ownerID,
		WorkspaceKey: workspaceKey,
		Language:     cfg.Language,
		ContainerID:  containerID,
		CreatedAt:    time.Now(),
		LastSeen:     time.Now(),
	}

	m.mu.Lock()
	defer m.mu.Unlock()

	if existing := m.sessions[key]; existing != nil {
		existing.touch()
		go func(containerID string) {
			_ = m.docker.Remove(context.Background(), containerID)
		}(containerID)
		return existing, nil
	}

	m.sessions[key] = created
	return created, nil
}

func (m *Manager) executeInSession(
	ctx context.Context,
	sess *session,
	cfg LangConfig,
	req RunRequest,
	timeout time.Duration,
) (*container.RunResult, error) {
	sess.mu.Lock()
	defer sess.mu.Unlock()

	sess.touch()

	runID := uuid.NewString()
	relativeRoot := buildRunRoot(cfg.Language, runID)
	runDir := buildRunDir(cfg.Language, runID)

	if err := m.docker.CopyFilesToContainer(ctx, sess.ContainerID, runnerBaseDir, buildRequestRunFiles(relativeRoot, cfg, req)); err != nil {
		return nil, err
	}

	var stdinReader io.Reader
	if req.Stdin != "" {
		stdinReader = strings.NewReader(req.Stdin)
	}

	return m.docker.Exec(ctx, container.ExecConfig{
		ContainerID: sess.ContainerID,
		Cmd:         buildRequestExecCommand(cfg, req, runDir),
		WorkingDir:  runnerBaseDir,
		Timeout:     timeout,
		Stdin:       stdinReader,
	})
}

func (m *Manager) discardSession(key string, expected *session) {
	m.mu.Lock()
	sess, ok := m.sessions[key]
	if ok && expected != nil && sess != expected {
		sess = nil
		ok = false
	}
	if ok {
		delete(m.sessions, key)
	}
	m.mu.Unlock()

	if ok && sess != nil {
		_ = m.docker.Remove(context.Background(), sess.ContainerID)
	}
}

func (m *Manager) reapLoop() {
	ticker := time.NewTicker(time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		now := time.Now()
		expired := make(map[string]*session)

		m.mu.Lock()
		for key, sess := range m.sessions {
			if now.Sub(sess.LastSeen) > sessionTTL {
				expired[key] = sess
				delete(m.sessions, key)
			}
		}
		m.mu.Unlock()

		for _, sess := range expired {
			_ = m.docker.Remove(context.Background(), sess.ContainerID)
		}
	}
}

// Shutdown destroys all active runner sessions.
func (m *Manager) Shutdown(ctx context.Context) {
	m.mu.Lock()
	sessions := make([]*session, 0, len(m.sessions))
	for key, sess := range m.sessions {
		sessions = append(sessions, sess)
		delete(m.sessions, key)
	}
	m.mu.Unlock()

	for _, sess := range sessions {
		_ = m.docker.Remove(ctx, sess.ContainerID)
	}
}
