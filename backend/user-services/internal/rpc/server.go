package rpc

import (
	"log"
	"net"

	userv1 "github.com/turmwerk/qeedu/backend/pkg/pb/user/v1"
	"github.com/turmwerk/qeedu/backend/user-services/internal/rpc/handler"
	"github.com/turmwerk/qeedu/backend/user-services/internal/services"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

// Serve starts the gRPC server on the given address (e.g. ":50051").
func Serve(addr string, svc *services.UserService) error {
	lis, err := net.Listen("tcp", addr)
	if err != nil {
		return err
	}

	s := grpc.NewServer()
	userv1.RegisterUserServiceServer(s, handler.NewUserHandler(svc))
	reflection.Register(s)

	log.Printf("[user-services] gRPC listening on %s", addr)
	return s.Serve(lis)
}
