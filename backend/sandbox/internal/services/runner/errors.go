package runner

import "errors"

var (
	ErrUnsupportedLanguage = errors.New("unsupported language")
	ErrTimeout             = errors.New("execution timed out")
	ErrContainerFailed     = errors.New("container failed to start")
	ErrCodeEmpty           = errors.New("code is empty")
)
