package rpc

import (
	"log"
	"net"

	sandboxv1 "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/pb/sandbox/v1"
	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/rpc/handler"
	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/runner"
	"github.com/dieWehmut/nju-edu-ai-system/backend/sandbox/internal/services/terminal"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

// Serve starts the gRPC server on the given address.
func Serve(addr string, runnerMgr *runner.Manager, terminalMgr *terminal.Manager) error {
	lis, err := net.Listen("tcp", addr)
	if err != nil {
		return err
	}

	s := grpc.NewServer()
	sandboxv1.RegisterRunnerServiceServer(s, handler.NewRunnerHandler(runnerMgr))
	sandboxv1.RegisterTerminalServiceServer(s, handler.NewTerminalHandler(terminalMgr))
	reflection.Register(s)

	log.Printf("[sandbox] gRPC listening on %s", addr)
	return s.Serve(lis)
}
