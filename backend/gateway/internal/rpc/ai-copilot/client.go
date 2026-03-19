package ai

import (
	"context"
	"log"

	aicopilotv1 "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/pb/ai-copilot/v1"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var client aicopilotv1.AICopilotServiceClient

func Init(addr string) {
	conn, err := grpc.NewClient(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("[rpc/ai-copilot] failed to connect to %s: %v", addr, err)
	}
	client = aicopilotv1.NewAICopilotServiceClient(conn)
	log.Printf("[rpc/ai-copilot] connected to %s", addr)
}

// Complete calls the AI Copilot Complete RPC.
func Complete(ctx context.Context, req *aicopilotv1.CompleteRequest) (*aicopilotv1.CompleteResponse, error) {
	return client.Complete(ctx, req)
}
