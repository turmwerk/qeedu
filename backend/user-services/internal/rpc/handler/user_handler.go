package handler

import (
	"context"

	userv1 "github.com/dieWehmut/nju-edu-ai-system/backend/proto/user/v1"
	"github.com/dieWehmut/nju-edu-ai-system/backend/user-services/internal/entity"
	"github.com/dieWehmut/nju-edu-ai-system/backend/user-services/internal/services"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"gorm.io/gorm"
)

type UserHandler struct {
	userv1.UnimplementedUserServiceServer
	svc *services.UserService
}

func NewUserHandler(svc *services.UserService) *UserHandler {
	return &UserHandler{svc: svc}
}

func (h *UserHandler) FindOrCreateOAuthUser(
	ctx context.Context,
	req *userv1.FindOrCreateOAuthUserRequest,
) (*userv1.FindOrCreateOAuthUserResponse, error) {
	if req.Profile == nil {
		return nil, status.Error(codes.InvalidArgument, "profile is required")
	}

	u, err := h.svc.FindOrCreateOAuthUser(services.OAuthProfile{
		Provider:   req.Profile.Provider,
		ProviderID: req.Profile.ProviderId,
		Name:       req.Profile.Name,
		Email:      req.Profile.Email,
		AvatarURL:  req.Profile.AvatarUrl,
	})
	if err != nil {
		return nil, status.Errorf(codes.Internal, "find or create user: %v", err)
	}

	return &userv1.FindOrCreateOAuthUserResponse{User: entityToProto(u)}, nil
}

func (h *UserHandler) GetUserByID(
	ctx context.Context,
	req *userv1.GetUserByIDRequest,
) (*userv1.GetUserByIDResponse, error) {
	u, err := h.svc.GetByID(uint(req.Id))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, status.Errorf(codes.NotFound, "user %d not found", req.Id)
		}
		return nil, status.Errorf(codes.Internal, "get user: %v", err)
	}
	return &userv1.GetUserByIDResponse{User: entityToProto(u)}, nil
}

func (h *UserHandler) GetUserByEmail(
	ctx context.Context,
	req *userv1.GetUserByEmailRequest,
) (*userv1.GetUserByEmailResponse, error) {
	u, err := h.svc.GetByEmail(req.Email)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, status.Errorf(codes.NotFound, "user with email %q not found", req.Email)
		}
		return nil, status.Errorf(codes.Internal, "get user: %v", err)
	}
	return &userv1.GetUserByEmailResponse{User: entityToProto(u)}, nil
}

func entityToProto(u *entity.User) *userv1.User {
	return &userv1.User{
		Id:         uint64(u.ID),
		Provider:   u.Provider,
		ProviderId: u.ProviderID,
		Name:       u.Name,
		Email:      u.Email,
		AvatarUrl:  u.AvatarURL,
		CreatedAt:  u.CreatedAt.Unix(),
		UpdatedAt:  u.UpdatedAt.Unix(),
	}
}
