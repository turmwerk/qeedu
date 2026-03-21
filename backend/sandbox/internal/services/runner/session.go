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
	return []string{"sh", "-lc", script}
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
