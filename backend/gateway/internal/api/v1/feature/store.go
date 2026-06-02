package feature

import (
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	ai "github.com/dieWehmut/nju-edu-ai-system/backend/gateway/internal/api/v1/ai"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type record = map[string]any

type bucket struct {
	Records  map[string]record
	Messages map[string][]record
}

var store = struct {
	sync.RWMutex
	Buckets map[string]*bucket
}{Buckets: map[string]*bucket{}}

func storeKey(c *gin.Context) string {
	uid, _ := c.Get("user_id")
	domain := strings.TrimSpace(c.GetString("feature_domain"))
	if domain == "" {
		domain = strings.TrimSpace(c.Param("domain"))
	}
	return strings.Join([]string{
		domain,
		strings.TrimSpace(c.Param("feature")),
		strings.TrimSpace(c.Param("resource")),
		strings.TrimSpace(toString(uid)),
	}, ":")
}

func toString(value any) string {
	switch v := value.(type) {
	case string:
		return v
	case nil:
		return ""
	default:
		return fmt.Sprint(v)
	}
}

func getBucket(c *gin.Context) *bucket {
	key := storeKey(c)
	store.Lock()
	defer store.Unlock()
	if current := store.Buckets[key]; current != nil {
		return current
	}
	next := &bucket{
		Records:  map[string]record{},
		Messages: map[string][]record{},
	}
	store.Buckets[key] = next
	return next
}

func copyRecord(src record) record {
	dst := make(record, len(src))
	for key, value := range src {
		dst[key] = value
	}
	return dst
}

func orderedRecords(records map[string]record) []record {
	items := make([]record, 0, len(records))
	for _, item := range records {
		items = append(items, copyRecord(item))
	}
	return items
}

// PageData returns generic metadata for feature pages.
func PageData(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"domain":     c.Param("domain"),
		"feature":    c.Param("feature"),
		"updated_at": time.Now().UnixMilli(),
	})
}

// List returns records for a feature resource.
func List(c *gin.Context) {
	b := getBucket(c)
	store.RLock()
	defer store.RUnlock()
	c.JSON(http.StatusOK, orderedRecords(b.Records))
}

// Create stores a feature record.
func Create(c *gin.Context) {
	var payload record
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}
	id := strings.TrimSpace(toString(payload["id"]))
	if id == "" {
		id = uuid.NewString()
	}
	now := time.Now().UnixMilli()
	payload["id"] = id
	if _, ok := payload["createdAt"]; !ok {
		payload["createdAt"] = now
	}
	payload["updatedAt"] = now

	b := getBucket(c)
	store.Lock()
	b.Records[id] = copyRecord(payload)
	store.Unlock()

	c.JSON(http.StatusOK, payload)
}

// Detail returns one feature record.
func Detail(c *gin.Context) {
	b := getBucket(c)
	id := c.Param("id")
	store.RLock()
	item, ok := b.Records[id]
	store.RUnlock()
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}
	c.JSON(http.StatusOK, copyRecord(item))
}

// Update patches a feature record.
func Update(c *gin.Context) {
	var patch record
	if err := c.ShouldBindJSON(&patch); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request: " + err.Error()})
		return
	}
	b := getBucket(c)
	id := c.Param("id")

	store.Lock()
	defer store.Unlock()
	item, ok := b.Records[id]
	if !ok {
		item = record{"id": id, "createdAt": time.Now().UnixMilli()}
	}
	for key, value := range patch {
		if key == "id" {
			continue
		}
		item[key] = value
	}
	item["updatedAt"] = time.Now().UnixMilli()
	b.Records[id] = item
	c.JSON(http.StatusOK, copyRecord(item))
}

// Remove deletes a feature record.
func Remove(c *gin.Context) {
	b := getBucket(c)
	id := c.Param("id")
	store.Lock()
	delete(b.Records, id)
	delete(b.Messages, id)
	store.Unlock()
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

// Messages returns stored feature conversation messages.
func Messages(c *gin.Context) {
	b := getBucket(c)
	id := c.Param("id")
	store.RLock()
	messages := append([]record(nil), b.Messages[id]...)
	store.RUnlock()
	c.JSON(http.StatusOK, messages)
}

// Chat reuses the global AI chat streaming backend for feature-scoped chat paths.
func Chat(c *gin.Context) {
	ai.Chat(c)
}
