package runner

import "time"

// LangConfig describes how to run code for a specific language.
type LangConfig struct {
	Language    string
	Image       string
	Filename    string
	CompileCmd  []string // nil for interpreted languages
	RunCmd      []string
	Timeout     time.Duration
	MemoryLimit int64 // bytes
}

// RunRequest is the internal representation of a code execution request.
type RunRequest struct {
	Language string
	Code     string
	Stdin    string
	Timeout  time.Duration // 0 means use LangConfig default
}

// RunResult is the internal representation of a code execution result.
type RunResult struct {
	Stdout      string
	Stderr      string
	ExitCode    int
	ExecutionMs int64
}
