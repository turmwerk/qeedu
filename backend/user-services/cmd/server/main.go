package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	db "github.com/turmwerk/qeedu/backend/pkg/mysql"
	"github.com/turmwerk/qeedu/backend/user-services/internal/entity"
	"github.com/turmwerk/qeedu/backend/user-services/internal/repository"
	"github.com/turmwerk/qeedu/backend/user-services/internal/rpc"
	"github.com/turmwerk/qeedu/backend/user-services/internal/services"
)

func main() {
	_ = godotenv.Load()

	dsn := os.Getenv("DATABASE_DSN")
	if dsn == "" {
		log.Fatal("[user-services] DATABASE_DSN is required")
	}

	db.Init(dsn)
	if err := db.DB.AutoMigrate(
		&entity.User{},
		&entity.UserIdentity{},
		&entity.UserPreference{},
		&entity.AccountEvent{},
		&entity.AccountFeedback{},
	); err != nil {
		log.Fatalf("[user-services] auto-migrate: %v", err)
	}

	repo := repository.NewUserRepo(db.DB)
	svc := services.NewUserService(repo)

	addr := os.Getenv("GRPC_ADDR")
	if addr == "" {
		addr = ":50051"
	}

	if err := rpc.Serve(addr, svc); err != nil {
		log.Fatalf("[user-services] grpc server: %v", err)
	}
}
