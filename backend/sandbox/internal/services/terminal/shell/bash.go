package shell

import "github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runtimeimages"

const (
	Bash      = "bash"
	BashImage = runtimeimages.TerminalBash
)

var BashCmd = []string{"/bin/bash", "--login", "-i"}
