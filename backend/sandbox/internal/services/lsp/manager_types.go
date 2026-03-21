package lsp

import (
	"errors"
	"sort"
	"time"

	sandboxv1 "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/pb/sandbox/v1"
)

const (
	workspaceDir = "/workspace"
	sessionTTL   = 30 * time.Minute
)

var (
	keepAliveCmd           = []string{"sleep", "infinity"}
	ErrUnsupportedLanguage = errors.New("unsupported language group")
	ErrSessionNotFound     = errors.New("lsp session not found")
)

type serverSpec struct {
	image    string
	command  []string
	memory   int64
	cpuQuota int64
}

type fileState struct {
	path       string
	languageID string
	version    int32
	open       bool
	content    string
}

type diagnosticRecord struct {
	FilePath    string
	StartLine   int32
	StartColumn int32
	EndLine     int32
	EndColumn   int32
	Severity    sandboxv1.DiagnosticSeverity
	Source      string
	Message     string
	Code        string
}

type completionRecord struct {
	Label         string
	InsertText    string
	Detail        string
	Documentation string
	Kind          string
}

type session struct {
	ID            string
	OwnerID       uint64
	WorkspaceKey  string
	LanguageGroup string
	ContainerID   string
	Proxy         *Proxy
	Files         map[string]*fileState
	Diagnostics   map[string][]diagnosticRecord
	CreatedAt     time.Time
	LastSeen      time.Time
}

func (s *session) touch() {
	s.LastSeen = time.Now()
}

func (s *session) cacheDiagnostics(filePath string, records []diagnosticRecord) {
	if len(records) == 0 {
		delete(s.Diagnostics, filePath)
		return
	}
	s.Diagnostics[filePath] = records
}

func (s *session) flattenDiagnostics() []diagnosticRecord {
	total := 0
	for _, items := range s.Diagnostics {
		total += len(items)
	}
	flattened := make([]diagnosticRecord, 0, total)
	for _, items := range s.Diagnostics {
		flattened = append(flattened, items...)
	}
	sort.Slice(flattened, func(i, j int) bool {
		if flattened[i].FilePath != flattened[j].FilePath {
			return flattened[i].FilePath < flattened[j].FilePath
		}
		if flattened[i].StartLine != flattened[j].StartLine {
			return flattened[i].StartLine < flattened[j].StartLine
		}
		if flattened[i].StartColumn != flattened[j].StartColumn {
			return flattened[i].StartColumn < flattened[j].StartColumn
		}
		return flattened[i].Message < flattened[j].Message
	})
	return flattened
}
