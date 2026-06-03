package sandbox

import (
	"context"
	"log"
	"strconv"
	"strings"

	sandboxv1 "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/pb/sandbox/v1"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"
)

var (
	runnerClient   sandboxv1.RunnerServiceClient
	terminalClient sandboxv1.TerminalServiceClient
	lspClient      sandboxv1.LSPServiceClient
)

const (
	runnerOwnerIDMetadataKey      = "x-sandbox-owner-id"
	runnerWorkspaceKeyMetadataKey = "x-sandbox-workspace-key"
)

// Init connects to the sandbox gRPC server.
func Init(addr string) {
	conn, err := grpc.NewClient(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("[rpc/sandbox] failed to connect to %s: %v", addr, err)
	}
	runnerClient = sandboxv1.NewRunnerServiceClient(conn)
	terminalClient = sandboxv1.NewTerminalServiceClient(conn)
	lspClient = sandboxv1.NewLSPServiceClient(conn)
	log.Printf("[rpc/sandbox] connected to %s", addr)
}

// RunCode calls the sandbox RunnerService.RunCode RPC.
func RunCode(
	ctx context.Context,
	language string,
	code string,
	stdin string,
	timeoutSeconds int32,
	ownerID uint64,
	workspaceKey string,
	files []*sandboxv1.RunFile,
) (*sandboxv1.RunCodeResponse, error) {
	if ownerID > 0 {
		ctx = metadata.AppendToOutgoingContext(ctx, runnerOwnerIDMetadataKey, strconv.FormatUint(ownerID, 10))
	}
	if workspaceKey = strings.TrimSpace(workspaceKey); workspaceKey != "" {
		ctx = metadata.AppendToOutgoingContext(ctx, runnerWorkspaceKeyMetadataKey, workspaceKey)
	}
	return runnerClient.RunCode(ctx, &sandboxv1.RunCodeRequest{
		Language:       language,
		Code:           code,
		Stdin:          stdin,
		TimeoutSeconds: timeoutSeconds,
		Files:          files,
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

func EnsureLSPSession(ctx context.Context, req *sandboxv1.EnsureSessionRequest) (*sandboxv1.EnsureSessionResponse, error) {
	return lspClient.EnsureSession(ctx, req)
}

func SyncLSPFile(ctx context.Context, req *sandboxv1.SyncFileRequest) (*sandboxv1.SyncFileResponse, error) {
	return lspClient.SyncFile(ctx, req)
}

func GetLSPDiagnostics(ctx context.Context, req *sandboxv1.GetDiagnosticsRequest) (*sandboxv1.GetDiagnosticsResponse, error) {
	return lspClient.GetDiagnostics(ctx, req)
}

func GetLSPCompletions(ctx context.Context, req *sandboxv1.GetCompletionsRequest) (*sandboxv1.GetCompletionsResponse, error) {
	return lspClient.GetCompletions(ctx, req)
}

func DestroyLSPSession(ctx context.Context, sessionID string) error {
	_, err := lspClient.DestroySession(ctx, &sandboxv1.DestroyLSPSessionRequest{SessionId: sessionID})
	return err
}
