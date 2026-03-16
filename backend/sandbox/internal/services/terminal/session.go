package terminal

import (
	"io"
	"sync"
	"time"

	"github.com/docker/docker/api/types"
)

// Session represents an interactive terminal session backed by a Docker exec.
type Session struct {
	ID          string
	ContainerID string
	ExecID      string
	Conn        types.HijackedResponse
	CreatedAt   time.Time
	mu          sync.Mutex
	closed      bool
}

// Write sends data from the client to the PTY stdin.
func (s *Session) Write(data []byte) (int, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.closed {
		return 0, io.ErrClosedPipe
	}
	return s.Conn.Conn.Write(data)
}

// Read reads data from the PTY stdout.
func (s *Session) Read(buf []byte) (int, error) {
	return s.Conn.Reader.Read(buf)
}

// Close tears down the session.
func (s *Session) Close() {
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.closed {
		return
	}
	s.closed = true
	s.Conn.Close()
}

// IsClosed returns whether the session has been closed.
func (s *Session) IsClosed() bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.closed
}
