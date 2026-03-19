package sandbox

import (
	"context"
	"log"

	sandboxv1 "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/pb/sandbox/v1"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var (
	runnerClient   sandboxv1.RunnerServiceClient
	terminalClient sandboxv1.TerminalServiceClient
)

// Init connects to the sandbox gRPC server.
func Init(addr string) {
	conn, err := grpc.NewClient(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("[rpc/sandbox] failed to connect to %s: %v", addr, err)
	}
	runnerClient = sandboxv1.NewRunnerServiceClient(conn)
	terminalClient = sandboxv1.NewTerminalServiceClient(conn)
	log.Printf("[rpc/sandbox] connected to %s", addr)
}

// RunCode calls the sandbox RunnerService.RunCode RPC.
func RunCode(ctx context.Context, language, code, stdin string, timeoutSeconds int32) (*sandboxv1.RunCodeResponse, error) {
	return runnerClient.RunCode(ctx, &sandboxv1.RunCodeRequest{
		Language:       language,
		Code:           code,
		Stdin:          stdin,
		TimeoutSeconds: timeoutSeconds,
	})
}

// ExecuteCommand calls the sandbox TerminalService.ExecuteCommand RPC.
func ExecuteCommand(ctx context.Context, command, shell, workingDir string, timeoutSeconds int32) (*sandboxv1.ExecuteCommandResponse, error) {
	return terminalClient.ExecuteCommand(ctx, &sandboxv1.ExecuteCommandRequest{
		Command:        command,
		Shell:          shell,
		WorkingDir:     workingDir,
		TimeoutSeconds: timeoutSeconds,
	})
}

// CreateSession calls the sandbox TerminalService.CreateSession RPC.
func CreateSession(ctx context.Context, shell string, cols, rows int32) (string, error) {
	resp, err := terminalClient.CreateSession(ctx, &sandboxv1.CreateSessionRequest{
		Shell: shell,
		Cols:  cols,
		Rows:  rows,
	})
	if err != nil {
		return "", err
	}
	return resp.SessionId, nil
}

// DestroySession calls the sandbox TerminalService.DestroySession RPC.
func DestroySession(ctx context.Context, sessionID string) error {
	_, err := terminalClient.DestroySession(ctx, &sandboxv1.DestroySessionRequest{
		SessionId: sessionID,
	})
	return err
}

// OpenInteractiveSession opens a bidirectional stream for an interactive terminal session.
func OpenInteractiveSession(ctx context.Context) (sandboxv1.TerminalService_InteractiveSessionClient, error) {
	return terminalClient.InteractiveSession(ctx)
}
