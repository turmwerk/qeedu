package main

import (
	"log"
	"os"

	db "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/mysql"
	"github.com/dieWehmut/nju-edu-ai-system/backend/user-services/internal/entity"
	"github.com/dieWehmut/nju-edu-ai-system/backend/user-services/internal/repository"
	"github.com/dieWehmut/nju-edu-ai-system/backend/user-services/internal/rpc"
	"github.com/dieWehmut/nju-edu-ai-system/backend/user-services/internal/services"
	"github.com/joho/godotenv"
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
