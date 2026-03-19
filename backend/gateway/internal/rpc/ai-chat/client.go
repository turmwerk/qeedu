package ai

import (
	"context"
	"io"
	"log"

	aichatv1 "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/pb/ai-chat/v1"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var client aichatv1.AIChatServiceClient

func Init(addr string) {
	conn, err := grpc.NewClient(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("[rpc/ai-chat] failed to connect to %s: %v", addr, err)
	}
	client = aichatv1.NewAIChatServiceClient(conn)
	log.Printf("[rpc/ai-chat] connected to %s", addr)
}

// ChatStream opens a streaming Chat RPC and returns a channel of deltas.
func ChatStream(ctx context.Context, req *aichatv1.ChatRequest) (<-chan *aichatv1.ChatResponse, <-chan error) {
	ch := make(chan *aichatv1.ChatResponse, 64)
	errCh := make(chan error, 1)

	go func() {
		defer close(ch)
		defer close(errCh)

		stream, err := client.Chat(ctx, req)
		if err != nil {
			errCh <- err
			return
		}
		for {
			resp, err := stream.Recv()
			if err == io.EOF {
				return
			}
			if err != nil {
				errCh <- err
				return
			}
			ch <- resp
		}
	}()
	return ch, errCh
}

// FixBugStream opens a streaming FixBug RPC.
func FixBugStream(ctx context.Context, req *aichatv1.FixBugRequest) (<-chan *aichatv1.FixBugResponse, <-chan error) {
	ch := make(chan *aichatv1.FixBugResponse, 64)
	errCh := make(chan error, 1)

	go func() {
		defer close(ch)
		defer close(errCh)

		stream, err := client.FixBug(ctx, req)
		if err != nil {
			errCh <- err
			return
		}
		for {
			resp, err := stream.Recv()
			if err == io.EOF {
				return
			}
			if err != nil {
				errCh <- err
				return
			}
			ch <- resp
		}
	}()
	return ch, errCh
}
