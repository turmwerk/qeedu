package services

import (
	"errors"

	"github.com/dieWehmut/nju-edu-ai-system/backend/user-services/internal/entity"
	"github.com/dieWehmut/nju-edu-ai-system/backend/user-services/internal/repository"
	"gorm.io/gorm"
)

type UserService struct {
	repo *repository.UserRepo
}

func NewUserService(repo *repository.UserRepo) *UserService {
	return &UserService{repo: repo}
}

// OAuthProfile is the info we receive from an OAuth provider.
type OAuthProfile struct {
	Provider   string // "github" | "google"
	ProviderID string // unique ID from provider
	Name       string
	Email      string
	AvatarURL  string
}

// FindOrCreateOAuthUser finds an existing user by provider+ID or creates a new one.
// On subsequent logins it also refreshes name / email / avatar.
func (s *UserService) FindOrCreateOAuthUser(p OAuthProfile) (*entity.User, error) {
	u, err := s.repo.FindByProvider(p.Provider, p.ProviderID)
	if err == nil {
		// Update profile fields that may have changed upstream
		u.Name = p.Name
		u.Email = p.Email
		u.AvatarURL = p.AvatarURL
		_ = s.repo.Update(u)
		return u, nil
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	// New user
	u = &entity.User{
		Provider:   p.Provider,
		ProviderID: p.ProviderID,
		Name:       p.Name,
		Email:      p.Email,
		AvatarURL:  p.AvatarURL,
	}
	if err := s.repo.Create(u); err != nil {
		return nil, err
	}
	return u, nil
}

// GetByID returns a user by internal ID.
func (s *UserService) GetByID(id uint) (*entity.User, error) {
	return s.repo.FindByID(id)
}

// GetByEmail returns a user by email.
func (s *UserService) GetByEmail(email string) (*entity.User, error) {
	return s.repo.FindByEmail(email)
}
