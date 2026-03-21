package container

import (
	"archive/tar"
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	imagetypes "github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/stdcopy"
)

// Client wraps the Docker SDK client with sandbox-specific operations.
type Client struct {
	docker *client.Client
}

// NewClient creates a Docker client from environment variables.
func NewClient() (*Client, error) {
	opts := []client.Opt{client.FromEnv, client.WithAPIVersionNegotiation()}
	if os.Getenv("DOCKER_HOST") == "" {
		opts = append(opts, client.WithHost("unix:///var/run/docker.sock"))
	}
	cli, err := client.NewClientWithOpts(opts...)
	if err != nil {
		return nil, err
	}
	return &Client{docker: cli}, nil
}

// RunConfig holds parameters for creating and running a container.
type RunConfig struct {
	Image      string
	Cmd        []string
	WorkingDir string
	Memory     int64
	CPUQuota   int64
	Timeout    time.Duration
	Stdin      io.Reader
	Files      map[string][]byte // filename -> content, copied via tar into WorkingDir
}

type PersistentContainerConfig struct {
	Image       string
	Cmd         []string
	WorkingDir  string
	Memory      int64
	CPUQuota    int64
	Tty         bool
	OpenStdin   bool
	AttachStdin bool
}

type ExecConfig struct {
	ContainerID string
	Cmd         []string
	WorkingDir  string
	Timeout     time.Duration
	Stdin       io.Reader
}

// RunResult holds the output from a container execution.
type RunResult struct {
	Stdout   string
	Stderr   string
	ExitCode int
}

func isMissingImageError(err error) bool {
	return err != nil && strings.Contains(err.Error(), "No such image")
}

func runtimeImageContext(image string) (string, bool) {
	root := "/sandbox-runtime"
	contexts := map[string]string{
		"nju-sandbox-python:latest":         filepath.Join(root, "python"),
		"nju-sandbox-javascript:latest":     filepath.Join(root, "javascript"),
		"nju-sandbox-typescript:latest":     filepath.Join(root, "typescript"),
		"nju-sandbox-go:latest":             filepath.Join(root, "go"),
		"nju-sandbox-java:latest":           filepath.Join(root, "java"),
		"nju-sandbox-c:latest":              filepath.Join(root, "c"),
		"nju-sandbox-cpp:latest":            filepath.Join(root, "cpp"),
		"nju-sandbox-rust:latest":           filepath.Join(root, "rust"),
		"nju-sandbox-csharp:latest":         filepath.Join(root, "csharp"),
		"nju-sandbox-terminal-bash:latest":  filepath.Join(root, "terminal-bash"),
		"nju-sandbox-lsp-go:latest":         filepath.Join(root, "lsp", "go"),
		"nju-sandbox-lsp-python:latest":     filepath.Join(root, "lsp", "python"),
		"nju-sandbox-lsp-typescript:latest": filepath.Join(root, "lsp", "typescript"),
		"nju-sandbox-lsp-java:latest":       filepath.Join(root, "lsp", "java"),
		"nju-sandbox-lsp-cpp:latest":        filepath.Join(root, "lsp", "cpp"),
		"nju-sandbox-lsp-rust:latest":       filepath.Join(root, "lsp", "rust"),
		"nju-sandbox-lsp-csharp:latest":     filepath.Join(root, "lsp", "csharp"),
	}
	contextDir, ok := contexts[image]
	return contextDir, ok
}

func buildRuntimeImage(ctx context.Context, image string) error {
	contextDir, ok := runtimeImageContext(image)
	if !ok {
		return fmt.Errorf("unknown runtime image %s", image)
	}

	cmd := exec.CommandContext(ctx, "docker", "build", "-t", image, contextDir)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("build runtime image %s: %w: %s", image, err, strings.TrimSpace(string(output)))
	}
	return nil
}

// EnsureImage makes sure the target image exists locally before container create.
func (c *Client) EnsureImage(ctx context.Context, image string) error {
	if strings.TrimSpace(image) == "" {
		return nil
	}

	if _, ok := runtimeImageContext(image); ok {
		return buildRuntimeImage(ctx, image)
	}

	reader, err := c.docker.ImagePull(ctx, image, imagetypes.PullOptions{})
	if err != nil {
		return fmt.Errorf("pull image %s: %w", image, err)
	}
	defer reader.Close()

	if _, err := io.Copy(io.Discard, reader); err != nil {
		return fmt.Errorf("read pull output for %s: %w", image, err)
	}

	return nil
}

func (c *Client) EnsureRuntimeImages(ctx context.Context, images []string) error {
	for _, image := range images {
		if strings.TrimSpace(image) == "" {
			continue
		}
		if _, _, err := c.docker.ImageInspectWithRaw(ctx, image); err == nil {
			continue
		}
		if err := c.EnsureImage(ctx, image); err != nil {
			return err
		}
	}
	return nil
}

func (c *Client) createContainer(
	ctx context.Context,
	containerCfg *container.Config,
	hostCfg *container.HostConfig,
) (container.CreateResponse, error) {
	resp, err := c.docker.ContainerCreate(ctx, containerCfg, hostCfg, nil, nil, "")
	if !isMissingImageError(err) {
		return resp, err
	}

	if pullErr := c.EnsureImage(ctx, containerCfg.Image); pullErr != nil {
		return resp, fmt.Errorf("%w; %v", err, pullErr)
	}

	return c.docker.ContainerCreate(ctx, containerCfg, hostCfg, nil, nil, "")
}

// Run creates a container, copies files in, starts it, waits for completion
// or timeout, captures output, and removes the container.
func (c *Client) Run(ctx context.Context, cfg RunConfig) (*RunResult, error) {
	containerCfg := &container.Config{
		Image:       cfg.Image,
		Cmd:         cfg.Cmd,
		Entrypoint:  []string{},
		WorkingDir:  cfg.WorkingDir,
		OpenStdin:   cfg.Stdin != nil,
		AttachStdin: cfg.Stdin != nil,
	}
	hostCfg := &container.HostConfig{
		NetworkMode: "none",
		Resources: container.Resources{
			Memory:   cfg.Memory,
			CPUQuota: cfg.CPUQuota,
		},
	}

	resp, err := c.createContainer(ctx, containerCfg, hostCfg)
	if err != nil {
		return nil, fmt.Errorf("create container: %w", err)
	}
	containerID := resp.ID
	defer c.docker.ContainerRemove(context.Background(), containerID, container.RemoveOptions{Force: true})

	// Copy files into the container
	if err := c.CopyFilesToContainer(ctx, containerID, cfg.WorkingDir, cfg.Files); err != nil {
		return nil, err
	}

	// Attach stdin if provided
	if cfg.Stdin != nil {
		attachResp, err := c.docker.ContainerAttach(ctx, containerID, container.AttachOptions{
			Stdin:  true,
			Stream: true,
		})
		if err != nil {
			return nil, fmt.Errorf("attach stdin: %w", err)
		}
		go func() {
			defer attachResp.CloseWrite()
			io.Copy(attachResp.Conn, cfg.Stdin)
		}()
	}

	// Start the container
	if err := c.docker.ContainerStart(ctx, containerID, container.StartOptions{}); err != nil {
		return nil, fmt.Errorf("start container: %w", err)
	}

	// Wait with timeout
	timeoutCtx, cancel := context.WithTimeout(ctx, cfg.Timeout)
	defer cancel()

	waitCh, errCh := c.docker.ContainerWait(timeoutCtx, containerID, container.WaitConditionNotRunning)
	var exitCode int

	select {
	case result := <-waitCh:
		exitCode = int(result.StatusCode)
	case err := <-errCh:
		if err != nil {
			// Timeout or other error — kill the container
			c.docker.ContainerKill(context.Background(), containerID, "SIGKILL")
			return nil, fmt.Errorf("wait: %w", err)
		}
	case <-timeoutCtx.Done():
		c.docker.ContainerKill(context.Background(), containerID, "SIGKILL")
		return nil, fmt.Errorf("execution timed out")
	}

	// Capture logs
	logReader, err := c.docker.ContainerLogs(ctx, containerID, container.LogsOptions{
		ShowStdout: true,
		ShowStderr: true,
	})
	if err != nil {
		return nil, fmt.Errorf("read logs: %w", err)
	}
	defer logReader.Close()

	var stdoutBuf, stderrBuf bytes.Buffer
	stdcopy.StdCopy(&stdoutBuf, &stderrBuf, logReader)

	return &RunResult{
		Stdout:   stdoutBuf.String(),
		Stderr:   stderrBuf.String(),
		ExitCode: exitCode,
	}, nil
}

func (c *Client) CreatePersistent(ctx context.Context, cfg PersistentContainerConfig) (string, error) {
	containerCfg := &container.Config{
		Image:       cfg.Image,
		Cmd:         cfg.Cmd,
		Entrypoint:  []string{},
		WorkingDir:  cfg.WorkingDir,
		Tty:         cfg.Tty,
		OpenStdin:   cfg.OpenStdin,
		AttachStdin: cfg.AttachStdin,
	}
	hostCfg := &container.HostConfig{
		NetworkMode: "none",
		Resources: container.Resources{
			Memory:   cfg.Memory,
			CPUQuota: cfg.CPUQuota,
		},
	}

	resp, err := c.createContainer(ctx, containerCfg, hostCfg)
	if err != nil {
		return "", fmt.Errorf("create persistent container: %w", err)
	}

	if err := c.docker.ContainerStart(ctx, resp.ID, container.StartOptions{}); err != nil {
		c.docker.ContainerRemove(ctx, resp.ID, container.RemoveOptions{Force: true})
		return "", fmt.Errorf("start persistent container: %w", err)
	}

	return resp.ID, nil
}

func (c *Client) Exec(ctx context.Context, cfg ExecConfig) (*RunResult, error) {
	execCfg := container.ExecOptions{
		Cmd:          cfg.Cmd,
		WorkingDir:   cfg.WorkingDir,
		AttachStdout: true,
		AttachStderr: true,
		AttachStdin:  cfg.Stdin != nil,
	}

	execResp, err := c.docker.ContainerExecCreate(ctx, cfg.ContainerID, execCfg)
	if err != nil {
		return nil, fmt.Errorf("exec create: %w", err)
	}

	execCtx := ctx
	cancel := func() {}
	if cfg.Timeout > 0 {
		execCtx, cancel = context.WithTimeout(ctx, cfg.Timeout)
	}
	defer cancel()

	attachResp, err := c.docker.ContainerExecAttach(execCtx, execResp.ID, container.ExecAttachOptions{})
	if err != nil {
		if errors.Is(execCtx.Err(), context.DeadlineExceeded) {
			return nil, fmt.Errorf("execution timed out")
		}
		return nil, fmt.Errorf("exec attach: %w", err)
	}
	defer attachResp.Close()

	if cfg.Stdin != nil {
		go func() {
			defer attachResp.CloseWrite()
			_, _ = io.Copy(attachResp.Conn, cfg.Stdin)
		}()
	}

	var stdoutBuf, stderrBuf bytes.Buffer
	outputDone := make(chan error, 1)
	go func() {
		_, err := stdcopy.StdCopy(&stdoutBuf, &stderrBuf, attachResp.Reader)
		if errors.Is(err, io.EOF) {
			err = nil
		}
		outputDone <- err
	}()

	select {
	case err := <-outputDone:
		if err != nil {
			if errors.Is(execCtx.Err(), context.DeadlineExceeded) {
				return nil, fmt.Errorf("execution timed out")
			}
			return nil, fmt.Errorf("read exec output: %w", err)
		}
	case <-execCtx.Done():
		if errors.Is(execCtx.Err(), context.DeadlineExceeded) {
			return nil, fmt.Errorf("execution timed out")
		}
		return nil, execCtx.Err()
	}

	for {
		inspect, err := c.docker.ContainerExecInspect(context.Background(), execResp.ID)
		if err != nil {
			return nil, fmt.Errorf("inspect exec: %w", err)
		}
		if !inspect.Running {
			return &RunResult{
				Stdout:   stdoutBuf.String(),
				Stderr:   stderrBuf.String(),
				ExitCode: inspect.ExitCode,
			}, nil
		}

		select {
		case <-time.After(10 * time.Millisecond):
		case <-execCtx.Done():
			if errors.Is(execCtx.Err(), context.DeadlineExceeded) {
				return nil, fmt.Errorf("execution timed out")
			}
			return nil, execCtx.Err()
		}
	}
}

// CreateInteractive creates a persistent container for terminal sessions.
func (c *Client) CreateInteractive(ctx context.Context, image string, shell []string) (string, error) {
	return c.CreatePersistent(ctx, PersistentContainerConfig{
		Image:       image,
		Cmd:         shell,
		Memory:      256 << 20,
		CPUQuota:    100000,
		Tty:         true,
		OpenStdin:   true,
		AttachStdin: true,
	})
}

// ExecAttach creates an exec instance in a running container with TTY
// and returns the hijacked connection for bidirectional IO.
func (c *Client) ExecAttach(ctx context.Context, containerID string, cmd []string, cols, rows uint) (string, types.HijackedResponse, error) {
	execCfg := container.ExecOptions{
		Cmd:          cmd,
		Tty:          true,
		AttachStdin:  true,
		AttachStdout: true,
		AttachStderr: true,
	}

	execResp, err := c.docker.ContainerExecCreate(ctx, containerID, execCfg)
	if err != nil {
		return "", types.HijackedResponse{}, fmt.Errorf("exec create: %w", err)
	}

	hijacked, err := c.docker.ContainerExecAttach(ctx, execResp.ID, container.ExecAttachOptions{Tty: true})
	if err != nil {
		return "", types.HijackedResponse{}, fmt.Errorf("exec attach: %w", err)
	}

	// Resize after attach
	if cols > 0 && rows > 0 {
		c.docker.ContainerExecResize(ctx, execResp.ID, container.ResizeOptions{
			Width:  cols,
			Height: rows,
		})
	}

	return execResp.ID, hijacked, nil
}

// ExecResize resizes an existing exec instance's TTY.
func (c *Client) ExecResize(ctx context.Context, execID string, cols, rows uint) error {
	return c.docker.ContainerExecResize(ctx, execID, container.ResizeOptions{
		Width:  cols,
		Height: rows,
	})
}

// Remove forcibly removes a container.
func (c *Client) Remove(ctx context.Context, containerID string) error {
	return c.docker.ContainerRemove(ctx, containerID, container.RemoveOptions{Force: true})
}

func (c *Client) CopyFilesToContainer(
	ctx context.Context,
	containerID string,
	workingDir string,
	files map[string][]byte,
) error {
	if len(files) == 0 {
		return nil
	}

	tarBuf, err := buildTar(files)
	if err != nil {
		return fmt.Errorf("build tar: %w", err)
	}
	if err := c.docker.CopyToContainer(ctx, containerID, workingDir, tarBuf, container.CopyToContainerOptions{}); err != nil {
		return fmt.Errorf("copy to container: %w", err)
	}
	return nil
}

// Close closes the underlying Docker client.
func (c *Client) Close() error {
	return c.docker.Close()
}

// buildTar creates an in-memory tar archive from a map of filename->content.
func buildTar(files map[string][]byte) (io.Reader, error) {
	var buf bytes.Buffer
	tw := tar.NewWriter(&buf)
	for name, content := range files {
		hdr := &tar.Header{
			Name: strings.TrimPrefix(name, "/"),
			Mode: 0644,
			Size: int64(len(content)),
		}
		if err := tw.WriteHeader(hdr); err != nil {
			return nil, err
		}
		if _, err := tw.Write(content); err != nil {
			return nil, err
		}
	}
	if err := tw.Close(); err != nil {
		return nil, err
	}
	return &buf, nil
}
