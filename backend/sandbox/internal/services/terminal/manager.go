package terminal

import (
	"context"
	"errors"
	"sync"
	"time"

	"github.com/google/uuid"

	"github.com/turmwerk/qeedu/backend/sandbox/internal/services/container"
	terminalshell "github.com/turmwerk/qeedu/backend/sandbox/internal/services/terminal/shell"
)

const (
	defaultShell = terminalshell.Bash
	sessionTTL   = 30 * time.Minute
)

var keepAliveCmd = []string{"sleep", "infinity"}

func resolveShellProfile(shell string) (image string, cmd []string) {
	switch shell {
	case terminalshell.Bash:
		return terminalshell.BashImage, terminalshell.BashCmd
	default:
		return terminalshell.BashImage, terminalshell.BashCmd
	}
}

func resolveCommandShell(shell string) []string {
	switch shell {
	case terminalshell.Bash:
		return []string{"/bin/bash", "-lc"}
	default:
		return []string{"/bin/bash", "-lc"}
	}
}

// Manager manages terminal sessions.
type Manager struct {
	docker   *container.Client
	sessions map[string]*Session
	mu       sync.RWMutex
}

func NewManager(docker *container.Client) *Manager {
	m := &Manager{
		docker:   docker,
		sessions: make(map[string]*Session),
	}
	go m.reapLoop()
	return m
}

// CreateSession spins up a new interactive container and exec session.
func (m *Manager) CreateSession(ctx context.Context, shell string, cols, rows int32) (*Session, error) {
	if shell == "" {
		shell = defaultShell
	}
	if cols <= 0 {
		cols = 80
	}
	if rows <= 0 {
		rows = 24
	}

	image, shellCmd := resolveShellProfile(shell)

	containerID, err := m.docker.CreateInteractive(ctx, image, keepAliveCmd)
	if err != nil {
		return nil, err
	}

	execID, conn, err := m.docker.ExecAttach(ctx, containerID, shellCmd, uint(cols), uint(rows))
	if err != nil {
		_ = m.docker.Remove(ctx, containerID)
		return nil, err
	}

	sess := &Session{
		ID:          uuid.New().String(),
		ContainerID: containerID,
		ExecID:      execID,
		Conn:        conn,
		CreatedAt:   time.Now(),
	}

	m.mu.Lock()
	m.sessions[sess.ID] = sess
	m.mu.Unlock()

	return sess, nil
}

// GetSession returns a session by ID.
func (m *Manager) GetSession(id string) (*Session, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	s, ok := m.sessions[id]
	return s, ok
}

// DestroySession closes and removes a session and its container.
func (m *Manager) DestroySession(ctx context.Context, id string) error {
	m.mu.Lock()
	sess, ok := m.sessions[id]
	if ok {
		delete(m.sessions, id)
	}
	m.mu.Unlock()

	if !ok {
		return nil
	}

	sess.Close()
	return m.docker.Remove(ctx, sess.ContainerID)
}

// ExecuteCommand runs a one-shot command in a fresh container.
func (m *Manager) ExecuteCommand(ctx context.Context, command, shell, workingDir string, timeout time.Duration) (stdout, stderr string, exitCode int, err error) {
	if shell == "" {
		shell = defaultShell
	}
	if timeout <= 0 {
		timeout = 10 * time.Second
	}
	if workingDir == "" {
		workingDir = "/root"
	}

	image, _ := resolveShellProfile(shell)
	shellCmd := resolveCommandShell(shell)

	result, err := m.docker.Run(ctx, container.RunConfig{
		Image:      image,
		Cmd:        append(shellCmd, command),
		WorkingDir: workingDir,
		Memory:     256 << 20,
		CPUQuota:   100000,
		Timeout:    timeout,
	})
	if err != nil {
		return "", "", -1, err
	}
	return result.Stdout, result.Stderr, result.ExitCode, nil
}

// Resize resizes the PTY of an existing session.
func (m *Manager) Resize(ctx context.Context, sessionID string, cols, rows uint) error {
	sess, ok := m.GetSession(sessionID)
	if !ok {
		return errors.New("session not found")
	}
	return m.docker.ExecResize(ctx, sess.ExecID, cols, rows)
}

// reapLoop periodically removes sessions that have exceeded their TTL.
func (m *Manager) reapLoop() {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()
	for range ticker.C {
		m.mu.Lock()
		now := time.Now()
		for id, s := range m.sessions {
			if now.Sub(s.CreatedAt) > sessionTTL || s.IsClosed() {
				s.Close()
				_ = m.docker.Remove(context.Background(), s.ContainerID)
				delete(m.sessions, id)
			}
		}
		m.mu.Unlock()
	}
}

// Shutdown destroys all active sessions.
func (m *Manager) Shutdown(ctx context.Context) {
	m.mu.Lock()
	defer m.mu.Unlock()
	for id, s := range m.sessions {
		s.Close()
		_ = m.docker.Remove(ctx, s.ContainerID)
		delete(m.sessions, id)
	}
}
