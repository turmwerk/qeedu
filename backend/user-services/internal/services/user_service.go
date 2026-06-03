package services

import (
	"errors"
	"fmt"
	"strings"
	"time"
	"unicode/utf8"

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
	ErrNameAlreadyExists  = errors.New("username already exists")
	ErrInvalidName        = errors.New("username must be 2-30 characters")
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

func validateName(name string) error {
	length := utf8.RuneCountInString(strings.TrimSpace(name))
	if length < 2 || length > 30 {
		return ErrInvalidName
	}
	return nil
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
	provider := strings.TrimSpace(p.Provider)
	providerID := strings.TrimSpace(p.ProviderID)
	if identity, err := s.repo.FindIdentityByProvider(provider, providerID); err == nil {
		u, getErr := s.repo.FindByID(identity.UserID)
		if getErr != nil {
			return nil, getErr
		}
		now := time.Now()
		identity.ProviderEmail = normalizeEmail(p.Email)
		identity.ProviderName = strings.TrimSpace(p.Name)
		identity.AvatarURL = strings.TrimSpace(p.AvatarURL)
		identity.LastUsedAt = &now
		_ = s.repo.UpsertIdentity(identity)
		return u, nil
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	u, err := s.repo.FindByProvider(p.Provider, p.ProviderID)
	if err == nil {
		// Update profile fields that may have changed upstream
		if strings.TrimSpace(p.Name) != "" {
			u.Name = strings.TrimSpace(p.Name)
		}
		if normalizeEmail(p.Email) != "" {
			u.Email = normalizeEmail(p.Email)
		}
		if strings.TrimSpace(p.AvatarURL) != "" {
			u.AvatarURL = strings.TrimSpace(p.AvatarURL)
		}
		_ = s.repo.Update(u)
		now := time.Now()
		_ = s.repo.UpsertIdentity(&entity.UserIdentity{
			UserID:         u.ID,
			Provider:       provider,
			ProviderUserID: providerID,
			ProviderEmail:  normalizeEmail(p.Email),
			ProviderName:   strings.TrimSpace(p.Name),
			AvatarURL:      strings.TrimSpace(p.AvatarURL),
			LastUsedAt:     &now,
		})
		return u, nil
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	// New user
	u = &entity.User{
		Provider:   strings.TrimSpace(p.Provider),
		ProviderID: strings.TrimSpace(p.ProviderID),
		Name:       strings.TrimSpace(p.Name),
		Email:      normalizeEmail(p.Email),
		AvatarURL:  strings.TrimSpace(p.AvatarURL),
	}
	if err := s.repo.Create(u); err != nil {
		return nil, err
	}
	now := time.Now()
	_ = s.repo.UpsertIdentity(&entity.UserIdentity{
		UserID:         u.ID,
		Provider:       provider,
		ProviderUserID: providerID,
		ProviderEmail:  normalizeEmail(p.Email),
		ProviderName:   strings.TrimSpace(p.Name),
		AvatarURL:      strings.TrimSpace(p.AvatarURL),
		LastUsedAt:     &now,
	})
	return u, nil
}

// FindOrCreateEmailUser finds a local email user or creates one without a password.
func (s *UserService) FindOrCreateEmailUser(email, name string) (*entity.User, error) {
	email = normalizeEmail(email)
	if email == "" {
		return nil, gorm.ErrRecordNotFound
	}

	u, err := s.repo.FindLocalByEmail(email)
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
	now := time.Now()
	_ = s.repo.UpsertIdentity(&entity.UserIdentity{
		UserID:         u.ID,
		Provider:       "email",
		ProviderUserID: email,
		ProviderEmail:  email,
		ProviderName:   u.Name,
		LastUsedAt:     &now,
	})
	return u, nil
}

// CreatePasswordUser registers a local email user with a password.
func (s *UserService) CreatePasswordUser(email, name, password string) (*entity.User, error) {
	email = normalizeEmail(email)
	name = normalizeName(name, email)
	if email == "" {
		return nil, gorm.ErrRecordNotFound
	}
	if err := validateName(name); err != nil {
		return nil, err
	}

	if nameUser, err := s.repo.FindLocalByName(name); err == nil && nameUser.ProviderID != email {
		return nil, ErrNameAlreadyExists
	} else if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	existing, err := s.repo.FindLocalByEmail(email)
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
		existing.Name = name
		existing.Email = email
		existing.PasswordHash = hashed
		if err := s.repo.Update(existing); err != nil {
			return nil, err
		}
		now := time.Now()
		_ = s.repo.UpsertIdentity(&entity.UserIdentity{
			UserID:         existing.ID,
			Provider:       "email",
			ProviderUserID: email,
			ProviderEmail:  email,
			ProviderName:   existing.Name,
			LastUsedAt:     &now,
		})
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
		Name:         name,
		Email:        email,
		PasswordHash: hashed,
	}
	if err := s.repo.Create(u); err != nil {
		return nil, err
	}
	now := time.Now()
	_ = s.repo.UpsertIdentity(&entity.UserIdentity{
		UserID:         u.ID,
		Provider:       "email",
		ProviderUserID: email,
		ProviderEmail:  email,
		ProviderName:   u.Name,
		LastUsedAt:     &now,
	})
	return u, nil
}

// VerifyPassword returns the user if the supplied password matches.
func (s *UserService) VerifyPassword(account, password string) (*entity.User, error) {
	account = strings.TrimSpace(account)
	if strings.Contains(account, "@") {
		account = normalizeEmail(account)
	}
	u, err := s.repo.FindLocalByAccount(account)
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

	u, err := s.repo.FindLocalByEmail(email)
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
	now := time.Now()
	_ = s.repo.UpsertIdentity(&entity.UserIdentity{
		UserID:         u.ID,
		Provider:       "email",
		ProviderUserID: email,
		ProviderEmail:  email,
		ProviderName:   u.Name,
		LastUsedAt:     &now,
	})
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
