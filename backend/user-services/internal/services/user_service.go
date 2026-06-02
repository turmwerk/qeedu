package services

import (
	"errors"
	"fmt"
	"strings"

	"github.com/dieWehmut/nju-edu-ai-system/backend/user-services/internal/entity"
	"github.com/dieWehmut/nju-edu-ai-system/backend/user-services/internal/repository"
	"golang.org/x/crypto/bcrypt"
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

var (
	ErrEmailAlreadyExists = errors.New("email already exists")
	ErrWeakPassword       = errors.New("password must be at least 6 characters")
	ErrInvalidCredential  = errors.New("invalid account or password")
	ErrNoPassword         = errors.New("user has no password")
)

func normalizeEmail(email string) string {
	return strings.ToLower(strings.TrimSpace(email))
}

func normalizeName(name, email string) string {
	name = strings.TrimSpace(name)
	if name != "" {
		return name
	}
	if at := strings.Index(email, "@"); at > 0 {
		return email[:at]
	}
	return email
}

func hashPassword(password string) (string, error) {
	if len(password) < 6 {
		return "", ErrWeakPassword
	}
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("hash password: %w", err)
	}
	return string(hashed), nil
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

// FindOrCreateEmailUser finds a local email user or creates one without a password.
func (s *UserService) FindOrCreateEmailUser(email, name string) (*entity.User, error) {
	email = normalizeEmail(email)
	if email == "" {
		return nil, gorm.ErrRecordNotFound
	}

	u, err := s.repo.FindByEmail(email)
	if err == nil {
		return u, nil
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	u = &entity.User{
		Provider:   "email",
		ProviderID: email,
		Name:       normalizeName(name, email),
		Email:      email,
	}
	if err := s.repo.Create(u); err != nil {
		return nil, err
	}
	return u, nil
}

// CreatePasswordUser registers a local email user with a password.
func (s *UserService) CreatePasswordUser(email, name, password string) (*entity.User, error) {
	email = normalizeEmail(email)
	if email == "" {
		return nil, gorm.ErrRecordNotFound
	}

	existing, err := s.repo.FindByEmail(email)
	if err == nil {
		if existing.PasswordHash != "" {
			return nil, ErrEmailAlreadyExists
		}
		hashed, hashErr := hashPassword(password)
		if hashErr != nil {
			return nil, hashErr
		}
		existing.Provider = "email"
		existing.ProviderID = email
		existing.Name = normalizeName(name, email)
		existing.PasswordHash = hashed
		if err := s.repo.Update(existing); err != nil {
			return nil, err
		}
		return existing, nil
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	hashed, err := hashPassword(password)
	if err != nil {
		return nil, err
	}
	u := &entity.User{
		Provider:     "email",
		ProviderID:   email,
		Name:         normalizeName(name, email),
		Email:        email,
		PasswordHash: hashed,
	}
	if err := s.repo.Create(u); err != nil {
		return nil, err
	}
	return u, nil
}

// VerifyPassword returns the user if the supplied password matches.
func (s *UserService) VerifyPassword(account, password string) (*entity.User, error) {
	account = strings.TrimSpace(account)
	u, err := s.repo.FindByAccount(account)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrInvalidCredential
		}
		return nil, err
	}
	if u.PasswordHash == "" {
		return nil, ErrNoPassword
	}
	if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password)); err != nil {
		return nil, ErrInvalidCredential
	}
	return u, nil
}

// UpdatePassword updates or creates a local password for the email user.
func (s *UserService) UpdatePassword(email, password string) (*entity.User, error) {
	email = normalizeEmail(email)
	hashed, err := hashPassword(password)
	if err != nil {
		return nil, err
	}

	u, err := s.repo.FindByEmail(email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return s.CreatePasswordUser(email, "", password)
		}
		return nil, err
	}
	u.Provider = "email"
	u.ProviderID = email
	u.PasswordHash = hashed
	if u.Name == "" {
		u.Name = normalizeName("", email)
	}
	if err := s.repo.Update(u); err != nil {
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
