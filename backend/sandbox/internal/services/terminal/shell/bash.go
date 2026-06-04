package shell

import "github.com/turmwerk/qeedu/backend/sandbox/internal/services/runtimeimages"

const (
	Bash      = "bash"
	BashImage = runtimeimages.TerminalBash
)

var BashCmd = []string{"/bin/bash", "--login", "-i"}
