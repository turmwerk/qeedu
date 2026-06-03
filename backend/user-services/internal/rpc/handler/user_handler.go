package handler

import (
	"context"
	"errors"

	userv1 "github.com/dieWehmut/nju-edu-ai-system/backend/pkg/pb/user/v1"
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

func (h *UserHandler) FindOrCreateEmailUser(
	ctx context.Context,
	req *userv1.FindOrCreateEmailUserRequest,
) (*userv1.FindOrCreateEmailUserResponse, error) {
	u, err := h.svc.FindOrCreateEmailUser(req.Email, req.Name)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, status.Error(codes.InvalidArgument, "email is required")
		}
		return nil, status.Errorf(codes.Internal, "find or create email user: %v", err)
	}
	return &userv1.FindOrCreateEmailUserResponse{User: entityToProto(u)}, nil
}

func (h *UserHandler) CreatePasswordUser(
	ctx context.Context,
	req *userv1.CreatePasswordUserRequest,
) (*userv1.CreatePasswordUserResponse, error) {
	u, err := h.svc.CreatePasswordUser(req.Email, req.Name, req.Password)
	if err != nil {
		switch {
		case errors.Is(err, services.ErrEmailAlreadyExists):
			return nil, status.Error(codes.AlreadyExists, err.Error())
		case errors.Is(err, services.ErrNameAlreadyExists):
			return nil, status.Error(codes.AlreadyExists, err.Error())
		case errors.Is(err, services.ErrWeakPassword), errors.Is(err, services.ErrInvalidName), err == gorm.ErrRecordNotFound:
			return nil, status.Error(codes.InvalidArgument, err.Error())
		default:
			return nil, status.Errorf(codes.Internal, "create password user: %v", err)
		}
	}
	return &userv1.CreatePasswordUserResponse{User: entityToProto(u)}, nil
}

func (h *UserHandler) VerifyPassword(
	ctx context.Context,
	req *userv1.VerifyPasswordRequest,
) (*userv1.VerifyPasswordResponse, error) {
	u, err := h.svc.VerifyPassword(req.Account, req.Password)
	if err != nil {
		switch {
		case errors.Is(err, services.ErrInvalidCredential):
			return nil, status.Error(codes.Unauthenticated, err.Error())
		case errors.Is(err, services.ErrNoPassword):
			return nil, status.Error(codes.FailedPrecondition, err.Error())
		default:
			return nil, status.Errorf(codes.Internal, "verify password: %v", err)
		}
	}
	return &userv1.VerifyPasswordResponse{User: entityToProto(u)}, nil
}

func (h *UserHandler) UpdatePassword(
	ctx context.Context,
	req *userv1.UpdatePasswordRequest,
) (*userv1.UpdatePasswordResponse, error) {
	u, err := h.svc.UpdatePassword(req.Email, req.NewPassword)
	if err != nil {
		switch {
		case errors.Is(err, services.ErrWeakPassword):
			return nil, status.Error(codes.InvalidArgument, err.Error())
		default:
			return nil, status.Errorf(codes.Internal, "update password: %v", err)
		}
	}
	return &userv1.UpdatePasswordResponse{User: entityToProto(u)}, nil
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
