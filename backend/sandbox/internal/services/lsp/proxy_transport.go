package lsp

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"strconv"
	"strings"
)

func (p *Proxy) waitLoop() {
	_ = p.cmd.Wait()
	p.Close()
}

func (p *Proxy) readLoop() {
	reader := bufio.NewReader(p.stdout)
	for {
		length, err := readContentLength(reader)
		if err != nil {
			if !errors.Is(err, io.EOF) {
				p.failPending(err)
			}
			p.Close()
			return
		}
		body := make([]byte, length)
		if _, err := io.ReadFull(reader, body); err != nil {
			p.failPending(err)
			p.Close()
			return
		}
		p.handleMessage(body)
	}
}

func (p *Proxy) readStderrLoop() {
	scanner := bufio.NewScanner(p.stderr)
	for scanner.Scan() {
		// Drain stderr to avoid blocking the language server process.
	}
}

func (p *Proxy) handleMessage(body []byte) {
	var envelope rpcEnvelope
	if err := json.Unmarshal(body, &envelope); err != nil {
		return
	}

	if envelope.Method == "textDocument/publishDiagnostics" {
		var params publishDiagnosticsParams
		if err := json.Unmarshal(envelope.Params, &params); err != nil {
			return
		}
		if p.onDiagnostics != nil {
			filePath, records := translateDiagnostics(params)
			p.onDiagnostics(filePath, records)
		}
		return
	}

	if len(envelope.ID) == 0 {
		return
	}

	id, err := parseID(envelope.ID)
	if err != nil {
		return
	}

	p.mu.Lock()
	ch, ok := p.pending[id]
	if ok {
		delete(p.pending, id)
	}
	p.mu.Unlock()
	if ok {
		ch <- envelope
	}
}

func (p *Proxy) request(ctx context.Context, method string, params any) ([]byte, error) {
	id := p.nextID.Add(1)
	envelope := map[string]any{
		"jsonrpc": "2.0",
		"id":      id,
		"method":  method,
		"params":  params,
	}
	responseCh := make(chan rpcEnvelope, 1)

	p.mu.Lock()
	p.pending[id] = responseCh
	p.mu.Unlock()

	if err := p.write(envelope); err != nil {
		p.mu.Lock()
		delete(p.pending, id)
		p.mu.Unlock()
		return nil, err
	}

	select {
	case <-ctx.Done():
		p.mu.Lock()
		delete(p.pending, id)
		p.mu.Unlock()
		return nil, ctx.Err()
	case response := <-responseCh:
		if response.Error != nil {
			return nil, fmt.Errorf("lsp %s: %s", method, response.Error.Message)
		}
		return response.Result, nil
	}
}

func (p *Proxy) notify(method string, params any) error {
	return p.write(map[string]any{
		"jsonrpc": "2.0",
		"method":  method,
		"params":  params,
	})
}

func (p *Proxy) write(payload any) error {
	if p.IsClosed() {
		return errors.New("lsp proxy already closed")
	}
	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal lsp payload: %w", err)
	}

	p.writeMu.Lock()
	defer p.writeMu.Unlock()

	if _, err := io.WriteString(p.stdin, fmt.Sprintf("Content-Length: %d\r\n\r\n", len(body))); err != nil {
		return fmt.Errorf("write lsp header: %w", err)
	}
	if _, err := p.stdin.Write(body); err != nil {
		return fmt.Errorf("write lsp body: %w", err)
	}
	return nil
}

func (p *Proxy) failPending(err error) {
	p.mu.Lock()
	defer p.mu.Unlock()
	for id, ch := range p.pending {
		ch <- rpcEnvelope{
			Error: &rpcError{Message: err.Error()},
		}
		delete(p.pending, id)
	}
}

func readContentLength(reader *bufio.Reader) (int, error) {
	length := 0
	for {
		line, err := reader.ReadString('\n')
		if err != nil {
			return 0, err
		}
		line = strings.TrimRight(line, "\r\n")
		if line == "" {
			break
		}
		if strings.HasPrefix(strings.ToLower(line), "content-length:") {
			value := strings.TrimSpace(strings.TrimPrefix(strings.ToLower(line), "content-length:"))
			length, err = strconv.Atoi(value)
			if err != nil {
				return 0, err
			}
		}
	}
	if length <= 0 {
		return 0, errors.New("missing content length")
	}
	return length, nil
}

func parseID(raw []byte) (int64, error) {
	var id int64
	if err := json.Unmarshal(raw, &id); err == nil {
		return id, nil
	}
	var text string
	if err := json.Unmarshal(raw, &text); err != nil {
		return 0, err
	}
	return strconv.ParseInt(text, 10, 64)
}
