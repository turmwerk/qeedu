package user

import (
	"context"
	"log"

	userv1 "github.com/dieWehmut/nju-edu-ai-system/backend/proto/user/v1"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var client userv1.UserServiceClient

// Init connects to the user-services gRPC server.
func Init(addr string) {
	conn, err := grpc.NewClient(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("[rpc/user] failed to connect to %s: %v", addr, err)
	}
	client = userv1.NewUserServiceClient(conn)
	log.Printf("[rpc/user] connected to %s", addr)
}

// FindOrCreateOAuthUser calls user-services to upsert an OAuth user.
func FindOrCreateOAuthUser(ctx context.Context, profile *userv1.OAuthProfile) (*userv1.User, error) {
	resp, err := client.FindOrCreateOAuthUser(ctx, &userv1.FindOrCreateOAuthUserRequest{
		Profile: profile,
	})
	if err != nil {
		return nil, err
	}
	return resp.User, nil
}

// GetUserByID calls user-services to get a user by ID.
func GetUserByID(ctx context.Context, id uint64) (*userv1.User, error) {
	resp, err := client.GetUserByID(ctx, &userv1.GetUserByIDRequest{Id: id})
	if err != nil {
		return nil, err
	}
	return resp.User, nil
}

// GetUserByEmail calls user-services to get a user by email.
func GetUserByEmail(ctx context.Context, email string) (*userv1.User, error) {
	resp, err := client.GetUserByEmail(ctx, &userv1.GetUserByEmailRequest{Email: email})
	if err != nil {
		return nil, err
	}
	return resp.User, nil
}
