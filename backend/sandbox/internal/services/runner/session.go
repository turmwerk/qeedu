package runner

import (
	"fmt"
	"path"
	"strings"
	"sync"
	"time"
)

const (
	sessionTTL      = 30 * time.Minute
	runnerRootDir   = "/tmp/nju-runner"
	runnerBaseDir   = "/tmp"
	defaultCPUQuota = 100000
)

var keepAliveCmd = []string{"sleep", "infinity"}

type session struct {
	OwnerID      uint64
	WorkspaceKey string
	Language     string
	ContainerID  string
	CreatedAt    time.Time
	LastSeen     time.Time
	mu           sync.Mutex
}

func (s *session) touch() {
	s.LastSeen = time.Now()
}

func sessionKey(ownerID uint64, workspaceKey string, language string) string {
	return fmt.Sprintf("%d:%s:%s", ownerID, strings.TrimSpace(workspaceKey), strings.ToLower(language))
}

func buildRunRoot(language string, runID string) string {
	return path.Join("nju-runner", strings.ToLower(language), runID)
}

func buildRunDir(language string, runID string) string {
	return path.Join(runnerRootDir, strings.ToLower(language), runID)
}

func buildRunFiles(relativeRoot string, cfg LangConfig, code string) map[string][]byte {
	files := map[string][]byte{
		path.Join(relativeRoot, cfg.Filename): []byte(code),
	}
	for name, content := range cfg.Files {
		files[path.Join(relativeRoot, name)] = []byte(content)
	}
	return files
}

func sanitizeRunFilePath(name string) string {
	cleaned := path.Clean("/" + strings.TrimSpace(name))
	cleaned = strings.TrimPrefix(cleaned, "/")
	if cleaned == "." || cleaned == "" || strings.HasPrefix(cleaned, "../") {
		return ""
	}
	return cleaned
}

func buildRequestRunFiles(relativeRoot string, cfg LangConfig, req RunRequest) map[string][]byte {
	files := buildRunFiles(relativeRoot, cfg, req.Code)
	for name, content := range req.Files {
		cleaned := sanitizeRunFilePath(name)
		if cleaned == "" {
			continue
		}
		files[path.Join(relativeRoot, cleaned)] = []byte(content)
	}
	return files
}

func hasRunFile(req RunRequest, filename string) bool {
	for name := range req.Files {
		if sanitizeRunFilePath(name) == filename {
			return true
		}
	}
	return false
}

func hasRunFilePrefix(req RunRequest, prefix string) bool {
	for name := range req.Files {
		if strings.HasPrefix(sanitizeRunFilePath(name), prefix) {
			return true
		}
	}
	return false
}

func buildRunCommands(cfg LangConfig, req RunRequest) ([]string, []string) {
	switch cfg.Language {
	case "go":
		if hasRunFile(req, "go.mod") {
			return nil, []string{"go", "run", "."}
		}
	case "rust":
		if hasRunFile(req, "Cargo.toml") {
			return nil, []string{"cargo", "run", "--quiet"}
		}
	case "java":
		if hasRunFilePrefix(req, "src/") {
			return []string{"sh", "-c", "mkdir -p out && javac src/*.java -d out"}, []string{"java", "-cp", "out", "Main"}
		}
	}
	return cfg.CompileCmd, cfg.RunCmd
}

func buildExecCommand(cfg LangConfig, runDir string) []string {
	runCmd := shellJoin(cfg.RunCmd)
	if len(cfg.CompileCmd) > 0 {
		runCmd = shellJoin(cfg.CompileCmd) + " && " + runCmd
	}

	script := fmt.Sprintf(
		"trap 'rm -rf %s' EXIT; cd %s && %s",
		shellQuote(runDir),
		shellQuote(runDir),
		runCmd,
	)
	return []string{"sh", "-c", script}
}

func buildRequestExecCommand(cfg LangConfig, req RunRequest, runDir string) []string {
	compileCmd, runCmdParts := buildRunCommands(cfg, req)
	runCmd := shellJoin(runCmdParts)
	if len(compileCmd) > 0 {
		runCmd = shellJoin(compileCmd) + " && " + runCmd
	}

	script := fmt.Sprintf(
		"trap 'rm -rf %s' EXIT; cd %s && %s",
		shellQuote(runDir),
		shellQuote(runDir),
		runCmd,
	)
	return []string{"sh", "-c", script}
}

func shellJoin(args []string) string {
	parts := make([]string, 0, len(args))
	for _, arg := range args {
		parts = append(parts, shellQuote(arg))
	}
	return strings.Join(parts, " ")
}

func shellQuote(value string) string {
	return "'" + strings.ReplaceAll(value, "'", `'"'"'`) + "'"
}
