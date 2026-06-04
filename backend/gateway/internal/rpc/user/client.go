package user

import (
	"context"
	"log"

	userv1 "github.com/turmwerk/qeedu/backend/pkg/pb/user/v1"
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

// FindOrCreateEmailUser calls user-services to find or create a local email user.
func FindOrCreateEmailUser(ctx context.Context, email, name string) (*userv1.User, error) {
	resp, err := client.FindOrCreateEmailUser(ctx, &userv1.FindOrCreateEmailUserRequest{
		Email: email,
		Name:  name,
	})
	if err != nil {
		return nil, err
	}
	return resp.User, nil
}

// CreatePasswordUser creates a local email user with password authentication.
func CreatePasswordUser(ctx context.Context, email, name, password string) (*userv1.User, error) {
	resp, err := client.CreatePasswordUser(ctx, &userv1.CreatePasswordUserRequest{
		Email:    email,
		Name:     name,
		Password: password,
	})
	if err != nil {
		return nil, err
	}
	return resp.User, nil
}

// VerifyPassword verifies account/password credentials via user-services.
func VerifyPassword(ctx context.Context, account, password string) (*userv1.User, error) {
	resp, err := client.VerifyPassword(ctx, &userv1.VerifyPasswordRequest{
		Account:  account,
		Password: password,
	})
	if err != nil {
		return nil, err
	}
	return resp.User, nil
}

// UpdatePassword updates the password for a local email user.
func UpdatePassword(ctx context.Context, email, password string) (*userv1.User, error) {
	resp, err := client.UpdatePassword(ctx, &userv1.UpdatePasswordRequest{
		Email:       email,
		NewPassword: password,
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
