package lsp

import (
	"context"
	"fmt"
	"path"
	"strings"

	sandboxv1 "github.com/turmwerk/qeedu/backend/pkg/pb/sandbox/v1"
	"github.com/turmwerk/qeedu/backend/sandbox/internal/services/runtimeimages"
)

func (m *Manager) syncWorkspace(ctx context.Context, sess *session, files []*sandboxv1.WorkspaceFile) error {
	for _, file := range files {
		if file == nil {
			continue
		}
		normalizedPath := normalizePath(file.GetPath())
		languageID := inferLanguageID(sess.LanguageGroup, normalizedPath)
		if languageID == "" {
			continue
		}
		if err := m.copyFile(ctx, sess, normalizedPath, file.GetContent()); err != nil {
			return err
		}

		version := int32(1)
		if existing := sess.Files[normalizedPath]; existing != nil {
			version = existing.version + 1
		}

		if existing := sess.Files[normalizedPath]; existing != nil && existing.open {
			existing.languageID = languageID
			existing.content = file.GetContent()
			existing.version = version
			if err := sess.Proxy.DidChange(ctx, normalizedPath, file.GetContent(), version); err != nil {
				return err
			}
			continue
		}

		sess.Files[normalizedPath] = &fileState{
			path:       normalizedPath,
			languageID: languageID,
			version:    version,
			open:       true,
			content:    file.GetContent(),
		}
		if err := sess.Proxy.DidOpen(ctx, normalizedPath, languageID, file.GetContent(), version); err != nil {
			return err
		}
	}
	return nil
}

func (m *Manager) copyFile(ctx context.Context, sess *session, filePath string, content string) error {
	return m.docker.CopyFilesToContainer(ctx, sess.ContainerID, workspaceDir, map[string][]byte{
		strings.TrimPrefix(filePath, "/"): []byte(content),
	})
}

func sessionKey(ownerID uint64, workspaceKey string, languageGroup string) string {
	return fmt.Sprintf("%d:%s:%s", ownerID, workspaceKey, languageGroup)
}

func resolveServerSpec(languageGroup string) (serverSpec, error) {
	switch languageGroup {
	case "go":
		return serverSpec{
			image:    runtimeimages.LSPGo,
			command:  []string{"gopls"},
			memory:   384 << 20,
			cpuQuota: 100000,
		}, nil
	case "python":
		return serverSpec{
			image:    runtimeimages.LSPPython,
			command:  []string{"pylsp"},
			memory:   384 << 20,
			cpuQuota: 100000,
		}, nil
	case "typescript":
		return serverSpec{
			image:    runtimeimages.LSPTypeScript,
			command:  []string{"typescript-language-server", "--stdio"},
			memory:   512 << 20,
			cpuQuota: 100000,
		}, nil
	case "java":
		return serverSpec{
			image:    runtimeimages.LSPJava,
			command:  []string{"jdtls", "-data", "/tmp/jdtls-data"},
			memory:   1024 << 20,
			cpuQuota: 100000,
		}, nil
	case "cpp":
		return serverSpec{
			image:    runtimeimages.LSPCpp,
			command:  []string{"clangd", "--background-index=false", "--log=error"},
			memory:   512 << 20,
			cpuQuota: 100000,
		}, nil
	case "rust":
		return serverSpec{
			image:    runtimeimages.LSPRust,
			command:  []string{"rust-analyzer"},
			memory:   512 << 20,
			cpuQuota: 100000,
		}, nil
	case "csharp":
		return serverSpec{
			image:    runtimeimages.LSPCSharp,
			command:  []string{"csharp-ls"},
			memory:   768 << 20,
			cpuQuota: 100000,
		}, nil
	default:
		return serverSpec{}, ErrUnsupportedLanguage
	}
}

func inferLanguageID(languageGroup string, filePath string) string {
	ext := strings.ToLower(path.Ext(filePath))
	switch languageGroup {
	case "go":
		if ext == ".go" {
			return "go"
		}
	case "python":
		if ext == ".py" {
			return "python"
		}
	case "java":
		if ext == ".java" {
			return "java"
		}
	case "typescript":
		switch ext {
		case ".ts", ".tsx", ".mts", ".cts":
			return "typescript"
		case ".js", ".jsx", ".mjs", ".cjs":
			return "javascript"
		}
	case "cpp":
		switch ext {
		case ".c", ".h":
			return "c"
		case ".cc", ".cp", ".cpp", ".cxx", ".hh", ".hpp", ".hxx":
			return "cpp"
		}
	case "rust":
		if ext == ".rs" {
			return "rust"
		}
	case "csharp":
		if ext == ".cs" {
			return "csharp"
		}
	}
	return ""
}

func normalizePath(filePath string) string {
	clean := path.Clean("/" + strings.TrimSpace(filePath))
	if clean == "." || clean == "/" {
		return "/"
	}
	return clean
}

func (m *Manager) cleanupSession(sess *session) error {
	if sess == nil {
		return nil
	}
	if sess.Proxy != nil {
		sess.Proxy.Close()
	}
	return m.docker.Remove(context.Background(), sess.ContainerID)
}
