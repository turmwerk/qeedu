package repository

import (
	"errors"

	"github.com/turmwerk/qeedu/backend/user-services/internal/entity"
	"gorm.io/gorm"
)

type UserRepo struct {
	db *gorm.DB
}

func NewUserRepo(db *gorm.DB) *UserRepo {
	return &UserRepo{db: db}
}

// FindByProvider looks up a user by OAuth provider + provider-side ID.
func (r *UserRepo) FindByProvider(provider, providerID string) (*entity.User, error) {
	var u entity.User
	err := r.db.Where("provider = ? AND provider_id = ?", provider, providerID).First(&u).Error
	if err != nil {
		return nil, err
	}
	return &u, nil
}

// Create inserts a new user row.
func (r *UserRepo) Create(u *entity.User) error {
	return r.db.Create(u).Error
}

// Update saves changed fields.
func (r *UserRepo) Update(u *entity.User) error {
	return r.db.Save(u).Error
}

// FindByID looks up a user by primary key.
func (r *UserRepo) FindByID(id uint) (*entity.User, error) {
	var u entity.User
	if err := r.db.First(&u, id).Error; err != nil {
		return nil, err
	}
	return &u, nil
}

// FindByEmail looks up a user by email address.
func (r *UserRepo) FindByEmail(email string) (*entity.User, error) {
	var u entity.User
	if err := r.db.Where("email = ?", email).First(&u).Error; err != nil {
		return nil, err
	}
	return &u, nil
}

// FindLocalByEmail looks up the local email/password identity for an email.
func (r *UserRepo) FindLocalByEmail(email string) (*entity.User, error) {
	var u entity.User
	if err := r.db.Where("provider = ? AND provider_id = ?", "email", email).First(&u).Error; err != nil {
		return nil, err
	}
	return &u, nil
}

// FindLocalByName looks up a local email/password identity by username.
func (r *UserRepo) FindLocalByName(name string) (*entity.User, error) {
	var u entity.User
	if err := r.db.Where("provider = ? AND name = ?", "email", name).First(&u).Error; err != nil {
		return nil, err
	}
	return &u, nil
}

// FindLocalByAccount looks up a local email/password identity by email or username.
func (r *UserRepo) FindLocalByAccount(account string) (*entity.User, error) {
	var u entity.User
	if err := r.db.Where(
		"provider = ? AND (provider_id = ? OR name = ?)",
		"email",
		account,
		account,
	).First(&u).Error; err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *UserRepo) FindIdentityByProvider(provider, providerUserID string) (*entity.UserIdentity, error) {
	var identity entity.UserIdentity
	if err := r.db.Where("provider = ? AND provider_user_id = ?", provider, providerUserID).First(&identity).Error; err != nil {
		return nil, err
	}
	return &identity, nil
}

func (r *UserRepo) UpsertIdentity(identity *entity.UserIdentity) error {
	if identity == nil {
		return errors.New("identity is nil")
	}
	var existing entity.UserIdentity
	err := r.db.Where("user_id = ? AND provider = ?", identity.UserID, identity.Provider).First(&existing).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return r.db.Create(identity).Error
		}
		return err
	}
	existing.ProviderUserID = identity.ProviderUserID
	existing.ProviderEmail = identity.ProviderEmail
	existing.ProviderName = identity.ProviderName
	existing.AvatarURL = identity.AvatarURL
	existing.LastUsedAt = identity.LastUsedAt
	return r.db.Save(&existing).Error
}
