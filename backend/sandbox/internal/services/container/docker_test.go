package container

import (
	"os"
	"path/filepath"
	"testing"
)

func TestRuntimeImageRootUsesEnvOverride(t *testing.T) {
	originalWD, err := os.Getwd()
	if err != nil {
		t.Fatalf("get wd: %v", err)
	}
	defer func() {
		if chdirErr := os.Chdir(originalWD); chdirErr != nil {
			t.Fatalf("restore wd: %v", chdirErr)
		}
	}()

	tempDir := t.TempDir()
	envRoot := filepath.Join(tempDir, "custom-runtime")
	if err := os.MkdirAll(envRoot, 0o755); err != nil {
		t.Fatalf("mkdir env root: %v", err)
	}

	if err := os.Chdir(tempDir); err != nil {
		t.Fatalf("chdir temp dir: %v", err)
	}
	t.Setenv("SANDBOX_RUNTIME_ROOT", envRoot)

	root, ok := runtimeImageRoot()
	if !ok {
		t.Fatal("expected runtime image root to be discovered from env")
	}

	expected, err := filepath.Abs(envRoot)
	if err != nil {
		t.Fatalf("abs env root: %v", err)
	}
	if root != expected {
		t.Fatalf("unexpected runtime root: got %q want %q", root, expected)
	}
}

func TestRuntimeImageContextFallsBackToRepoLayout(t *testing.T) {
	originalWD, err := os.Getwd()
	if err != nil {
		t.Fatalf("get wd: %v", err)
	}
	defer func() {
		if chdirErr := os.Chdir(originalWD); chdirErr != nil {
			t.Fatalf("restore wd: %v", chdirErr)
		}
	}()

	tempDir := t.TempDir()
	repoRuntimeRoot := filepath.Join(tempDir, "backend", "sandbox", "runtime")
	if err := os.MkdirAll(repoRuntimeRoot, 0o755); err != nil {
		t.Fatalf("mkdir repo runtime root: %v", err)
	}

	if err := os.Chdir(tempDir); err != nil {
		t.Fatalf("chdir temp dir: %v", err)
	}
	t.Setenv("SANDBOX_RUNTIME_ROOT", "")

	contextDir, ok := runtimeImageContext("qeedu-sandbox-python:latest")
	if !ok {
		t.Fatal("expected runtime image context to resolve from repo layout")
	}

	expected := filepath.Join(repoRuntimeRoot, "python")
	if contextDir != expected {
		t.Fatalf("unexpected runtime image context: got %q want %q", contextDir, expected)
	}
}
