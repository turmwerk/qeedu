package lsp

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"

	sandboxv1 "github.com/turmwerk/qeedu/backend/pkg/pb/sandbox/v1"
	"github.com/turmwerk/qeedu/backend/sandbox/internal/services/container"
)

// Manager manages language-server-backed diagnostics and completions.
type Manager struct {
	docker   *container.Client
	mu       sync.RWMutex
	sessions map[string]*session
	byKey    map[string]string
}

func NewManager(docker *container.Client) *Manager {
	m := &Manager{
		docker:   docker,
		sessions: make(map[string]*session),
		byKey:    make(map[string]string),
	}
	go m.reapLoop()
	return m
}

func (m *Manager) EnsureSession(
	ctx context.Context,
	ownerID uint64,
	workspaceKey string,
	languageGroup string,
	files []*sandboxv1.WorkspaceFile,
) (*session, error) {
	spec, err := resolveServerSpec(languageGroup)
	if err != nil {
		return nil, err
	}

	key := sessionKey(ownerID, workspaceKey, languageGroup)

	m.mu.Lock()
	var stale *session
	if sessionID, ok := m.byKey[key]; ok {
		if existing, exists := m.sessions[sessionID]; exists && existing.Proxy != nil && !existing.Proxy.IsClosed() {
			existing.touch()
			m.mu.Unlock()
			if err := m.syncWorkspace(ctx, existing, files); err != nil {
				return nil, err
			}
			return existing, nil
		}
		stale = m.sessions[sessionID]
		delete(m.byKey, key)
		delete(m.sessions, sessionID)
	}
	m.mu.Unlock()
	if stale != nil {
		m.cleanupSession(stale)
	}

	containerID, err := m.docker.CreatePersistent(ctx, container.PersistentContainerConfig{
		Image:      spec.image,
		Cmd:        keepAliveCmd,
		WorkingDir: workspaceDir,
		Memory:     spec.memory,
		CPUQuota:   spec.cpuQuota,
	})
	if err != nil {
		return nil, err
	}

	proxy, err := NewProxy(containerID, spec.command)
	if err != nil {
		_ = m.docker.Remove(context.Background(), containerID)
		return nil, err
	}

	if err := proxy.Initialize(ctx, workspaceDir); err != nil {
		proxy.Close()
		_ = m.docker.Remove(context.Background(), containerID)
		return nil, err
	}

	sess := &session{
		ID:            uuid.New().String(),
		OwnerID:       ownerID,
		WorkspaceKey:  workspaceKey,
		LanguageGroup: languageGroup,
		ContainerID:   containerID,
		Proxy:         proxy,
		Files:         make(map[string]*fileState),
		Diagnostics:   make(map[string][]diagnosticRecord),
		CreatedAt:     time.Now(),
		LastSeen:      time.Now(),
	}

	proxy.SetDiagnosticsHandler(func(filePath string, records []diagnosticRecord) {
		m.mu.Lock()
		defer m.mu.Unlock()
		current, ok := m.sessions[sess.ID]
		if !ok {
			return
		}
		current.cacheDiagnostics(filePath, records)
		current.touch()
	})

	m.mu.Lock()
	m.sessions[sess.ID] = sess
	m.byKey[key] = sess.ID
	m.mu.Unlock()

	if err := m.syncWorkspace(ctx, sess, files); err != nil {
		m.mu.Lock()
		delete(m.sessions, sess.ID)
		delete(m.byKey, key)
		m.mu.Unlock()
		m.cleanupSession(sess)
		return nil, err
	}

	return sess, nil
}

func (m *Manager) SyncFile(
	ctx context.Context,
	sessionID string,
	filePath string,
	content string,
	version int32,
) error {
	m.mu.Lock()
	sess, ok := m.sessions[sessionID]
	if !ok {
		m.mu.Unlock()
		return ErrSessionNotFound
	}
	sess.touch()
	m.mu.Unlock()

	normalizedPath := normalizePath(filePath)
	languageID := inferLanguageID(sess.LanguageGroup, normalizedPath)
	if languageID == "" {
		return ErrUnsupportedLanguage
	}

	if err := m.copyFile(ctx, sess, normalizedPath, content); err != nil {
		return err
	}

	m.mu.Lock()
	file := sess.Files[normalizedPath]
	if file == nil {
		file = &fileState{
			path:       normalizedPath,
			languageID: languageID,
		}
		sess.Files[normalizedPath] = file
	}
	shouldOpen := !file.open
	file.languageID = languageID
	file.version = version
	file.content = content
	if shouldOpen {
		file.open = true
	}
	m.mu.Unlock()

	if shouldOpen {
		return sess.Proxy.DidOpen(ctx, normalizedPath, languageID, content, version)
	}
	return sess.Proxy.DidChange(ctx, normalizedPath, content, version)
}

func (m *Manager) GetDiagnostics(sessionID string) ([]diagnosticRecord, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	sess, ok := m.sessions[sessionID]
	if !ok {
		return nil, ErrSessionNotFound
	}
	sess.touch()
	return sess.flattenDiagnostics(), nil
}

func (m *Manager) GetCompletions(
	ctx context.Context,
	sessionID string,
	filePath string,
	version int32,
	line int32,
	column int32,
) ([]completionRecord, error) {
	m.mu.Lock()
	sess, ok := m.sessions[sessionID]
	if !ok {
		m.mu.Unlock()
		return nil, ErrSessionNotFound
	}
	state := sess.Files[normalizePath(filePath)]
	sess.touch()
	m.mu.Unlock()

	if state == nil {
		return nil, fmt.Errorf("file %s has not been synchronized", filePath)
	}
	if version > 0 && state.version < version {
		return nil, fmt.Errorf("file %s is stale in session", filePath)
	}

	return sess.Proxy.Completion(ctx, state.path, line, column)
}

func (m *Manager) DestroySession(ctx context.Context, sessionID string) error {
	m.mu.Lock()
	sess, ok := m.sessions[sessionID]
	if ok {
		delete(m.sessions, sessionID)
		delete(m.byKey, sessionKey(sess.OwnerID, sess.WorkspaceKey, sess.LanguageGroup))
	}
	m.mu.Unlock()

	if !ok {
		return nil
	}

	return m.cleanupSession(sess)
}

func (m *Manager) Shutdown(ctx context.Context) {
	m.mu.Lock()
	ids := make([]string, 0, len(m.sessions))
	for id := range m.sessions {
		ids = append(ids, id)
	}
	m.mu.Unlock()

	for _, id := range ids {
		_ = m.DestroySession(ctx, id)
	}
}

func (m *Manager) reapLoop() {
	ticker := time.NewTicker(time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		now := time.Now()
		m.mu.Lock()
		expired := make([]*session, 0)
		for id, sess := range m.sessions {
			if now.Sub(sess.LastSeen) > sessionTTL || sess.Proxy.IsClosed() {
				expired = append(expired, sess)
				delete(m.byKey, sessionKey(sess.OwnerID, sess.WorkspaceKey, sess.LanguageGroup))
				delete(m.sessions, id)
			}
		}
		m.mu.Unlock()

		for _, sess := range expired {
			_ = m.cleanupSession(sess)
		}
	}
}
