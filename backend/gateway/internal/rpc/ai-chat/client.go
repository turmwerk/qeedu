package ai

import (
	"context"
	"io"
	"log"

	aichatv1 "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/pb/ai-chat/v1"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"
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

// requestCtx attaches model + api_key + base_url as gRPC metadata.
func requestCtx(ctx context.Context, model, apiKey, baseURL string) context.Context {
	md := metadata.New(nil)
	if model != "" {
		md.Set("x-model", model)
	}
	if apiKey != "" {
		md.Set("x-api-key", apiKey)
	}
	if baseURL != "" {
		md.Set("x-base-url", baseURL)
	}
	if md.Len() == 0 {
		return ctx
	}
	return metadata.NewOutgoingContext(ctx, md)
}

// ChatStream opens a streaming Chat RPC and returns a channel of deltas.
func ChatStream(ctx context.Context, req *aichatv1.ChatRequest, model, apiKey, baseURL string) (<-chan *aichatv1.ChatResponse, <-chan error) {
	ch := make(chan *aichatv1.ChatResponse, 64)
	errCh := make(chan error, 1)

	go func() {
		defer close(ch)
		defer close(errCh)

		stream, err := client.Chat(requestCtx(ctx, model, apiKey, baseURL), req)
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
func FixBugStream(ctx context.Context, req *aichatv1.FixBugRequest, model, apiKey, baseURL string) (<-chan *aichatv1.FixBugResponse, <-chan error) {
	ch := make(chan *aichatv1.FixBugResponse, 64)
	errCh := make(chan error, 1)

	go func() {
		defer close(ch)
		defer close(errCh)

		stream, err := client.FixBug(requestCtx(ctx, model, apiKey, baseURL), req)
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
