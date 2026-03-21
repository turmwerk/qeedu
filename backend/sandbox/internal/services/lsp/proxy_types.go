package lsp

import (
	"io"
	"os/exec"
	"sync"
	"sync/atomic"
)

type Proxy struct {
	cmd *exec.Cmd

	stdin  io.WriteCloser
	stdout io.ReadCloser
	stderr io.ReadCloser

	writeMu sync.Mutex
	mu      sync.Mutex
	pending map[int64]chan rpcEnvelope

	nextID atomic.Int64
	closed atomic.Bool

	onDiagnostics func(string, []diagnosticRecord)
}

type rpcEnvelope struct {
	JSONRPC string    `json:"jsonrpc"`
	ID      []byte    `json:"id,omitempty"`
	Method  string    `json:"method,omitempty"`
	Params  []byte    `json:"params,omitempty"`
	Result  []byte    `json:"result,omitempty"`
	Error   *rpcError `json:"error,omitempty"`
}

type rpcError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type initializeParams struct {
	ProcessID        *int32            `json:"processId"`
	RootURI          string            `json:"rootUri"`
	WorkspaceFolders []workspaceFolder `json:"workspaceFolders"`
	Capabilities     initializeCaps    `json:"capabilities"`
	Initialization   map[string]any    `json:"initializationOptions,omitempty"`
	Trace            string            `json:"trace,omitempty"`
}

type workspaceFolder struct {
	URI  string `json:"uri"`
	Name string `json:"name"`
}

type initializeCaps struct {
	TextDocument map[string]any `json:"textDocument,omitempty"`
	Workspace    map[string]any `json:"workspace,omitempty"`
	General      map[string]any `json:"general,omitempty"`
}

type textDocumentItem struct {
	URI        string `json:"uri"`
	LanguageID string `json:"languageId"`
	Version    int32  `json:"version"`
	Text       string `json:"text"`
}

type versionedTextDocumentIdentifier struct {
	URI     string `json:"uri"`
	Version int32  `json:"version"`
}

type didOpenParams struct {
	TextDocument textDocumentItem `json:"textDocument"`
}

type textDocumentContentChangeEvent struct {
	Text string `json:"text"`
}

type didChangeParams struct {
	TextDocument   versionedTextDocumentIdentifier  `json:"textDocument"`
	ContentChanges []textDocumentContentChangeEvent `json:"contentChanges"`
}

type completionParams struct {
	TextDocument textDocumentIdentifier `json:"textDocument"`
	Position     position               `json:"position"`
	Context      map[string]any         `json:"context,omitempty"`
}

type textDocumentIdentifier struct {
	URI string `json:"uri"`
}

type position struct {
	Line      int32 `json:"line"`
	Character int32 `json:"character"`
}

type publishDiagnosticsParams struct {
	URI         string                      `json:"uri"`
	Diagnostics []lspDiagnosticNotification `json:"diagnostics"`
}

type lspDiagnosticNotification struct {
	Range    lspRange `json:"range"`
	Severity int32    `json:"severity,omitempty"`
	Code     any      `json:"code,omitempty"`
	Source   string   `json:"source,omitempty"`
	Message  string   `json:"message"`
}

type lspRange struct {
	Start position `json:"start"`
	End   position `json:"end"`
}

type lspCompletionResponse struct {
	IsIncomplete bool                `json:"isIncomplete"`
	Items        []lspCompletionItem `json:"items"`
}

type lspCompletionItem struct {
	Label         string `json:"label"`
	InsertText    string `json:"insertText,omitempty"`
	Detail        string `json:"detail,omitempty"`
	Documentation any    `json:"documentation,omitempty"`
	Kind          int32  `json:"kind,omitempty"`
}
