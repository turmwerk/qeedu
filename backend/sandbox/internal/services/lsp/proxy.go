package lsp

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os/exec"
	"path"
)

func NewProxy(containerID string, command []string) (*Proxy, error) {
	cmd := exec.Command("docker", append([]string{"exec", "-i", containerID}, command...)...)
	stdin, err := cmd.StdinPipe()
	if err != nil {
		return nil, fmt.Errorf("open lsp stdin: %w", err)
	}
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return nil, fmt.Errorf("open lsp stdout: %w", err)
	}
	stderr, err := cmd.StderrPipe()
	if err != nil {
		return nil, fmt.Errorf("open lsp stderr: %w", err)
	}
	if err := cmd.Start(); err != nil {
		return nil, fmt.Errorf("start lsp proxy: %w", err)
	}

	p := &Proxy{
		cmd:     cmd,
		stdin:   stdin,
		stdout:  stdout,
		stderr:  stderr,
		pending: make(map[int64]chan rpcEnvelope),
	}
	go p.readLoop()
	go p.readStderrLoop()
	go p.waitLoop()

	return p, nil
}

func (p *Proxy) Initialize(ctx context.Context, rootDir string) error {
	rootURI := fileURI(path.Clean(rootDir))
	var processID *int32
	params := initializeParams{
		ProcessID: processID,
		RootURI:   rootURI,
		WorkspaceFolders: []workspaceFolder{
			{URI: rootURI, Name: path.Base(rootDir)},
		},
		Capabilities: initializeCaps{
			TextDocument: map[string]any{
				"publishDiagnostics": map[string]any{
					"relatedInformation": true,
				},
				"completion": map[string]any{
					"completionItem": map[string]any{
						"documentationFormat": []string{"markdown", "plaintext"},
					},
				},
			},
			Workspace: map[string]any{},
			General: map[string]any{
				"positionEncodings": []string{"utf-16"},
			},
		},
		Trace: "off",
	}
	if _, err := p.request(ctx, "initialize", params); err != nil {
		return err
	}
	return p.notify("initialized", map[string]any{})
}

func (p *Proxy) SetDiagnosticsHandler(handler func(string, []diagnosticRecord)) {
	p.onDiagnostics = handler
}

func (p *Proxy) DidOpen(
	ctx context.Context,
	filePath string,
	languageID string,
	content string,
	version int32,
) error {
	_ = ctx
	params := didOpenParams{
		TextDocument: textDocumentItem{
			URI:        workspaceFileURI(filePath),
			LanguageID: languageID,
			Version:    version,
			Text:       content,
		},
	}
	return p.notify("textDocument/didOpen", params)
}

func (p *Proxy) DidChange(
	ctx context.Context,
	filePath string,
	content string,
	version int32,
) error {
	_ = ctx
	params := didChangeParams{
		TextDocument: versionedTextDocumentIdentifier{
			URI:     workspaceFileURI(filePath),
			Version: version,
		},
		ContentChanges: []textDocumentContentChangeEvent{
			{Text: content},
		},
	}
	return p.notify("textDocument/didChange", params)
}

func (p *Proxy) Completion(
	ctx context.Context,
	filePath string,
	line int32,
	column int32,
) ([]completionRecord, error) {
	result, err := p.request(ctx, "textDocument/completion", completionParams{
		TextDocument: textDocumentIdentifier{URI: workspaceFileURI(filePath)},
		Position: position{
			Line:      maxInt32(line-1, 0),
			Character: maxInt32(column-1, 0),
		},
	})
	if err != nil {
		return nil, err
	}

	if string(result) == "null" {
		return nil, nil
	}

	var list lspCompletionResponse
	if err := json.Unmarshal(result, &list); err == nil && list.Items != nil {
		return translateCompletions(list.Items), nil
	}

	var items []lspCompletionItem
	if err := json.Unmarshal(result, &items); err != nil {
		return nil, fmt.Errorf("decode completion response: %w", err)
	}
	return translateCompletions(items), nil
}

func (p *Proxy) Close() {
	if p.closed.Swap(true) {
		return
	}
	_ = p.stdin.Close()
	if p.cmd.Process != nil {
		_ = p.cmd.Process.Kill()
	}
	p.failPending(errors.New("lsp proxy closed"))
}

func (p *Proxy) IsClosed() bool {
	return p.closed.Load()
}
