package container

import (
	"archive/tar"
	"bytes"
	"context"
	"fmt"
	"io"
	"os"
	"strings"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
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

// RunResult holds the output from a container execution.
type RunResult struct {
	Stdout   string
	Stderr   string
	ExitCode int
}

// Run creates a container, copies files in, starts it, waits for completion
// or timeout, captures output, and removes the container.
func (c *Client) Run(ctx context.Context, cfg RunConfig) (*RunResult, error) {
	containerCfg := &container.Config{
		Image:      cfg.Image,
		Cmd:        cfg.Cmd,
		WorkingDir: cfg.WorkingDir,
		OpenStdin:  cfg.Stdin != nil,
		AttachStdin: cfg.Stdin != nil,
	}
	hostCfg := &container.HostConfig{
		NetworkMode: "none",
		Resources: container.Resources{
			Memory:   cfg.Memory,
			CPUQuota: cfg.CPUQuota,
		},
	}

	resp, err := c.docker.ContainerCreate(ctx, containerCfg, hostCfg, nil, nil, "")
	if err != nil {
		return nil, fmt.Errorf("create container: %w", err)
	}
	containerID := resp.ID
	defer c.docker.ContainerRemove(context.Background(), containerID, container.RemoveOptions{Force: true})

	// Copy files into the container
	if len(cfg.Files) > 0 {
		tarBuf, err := buildTar(cfg.Files)
		if err != nil {
			return nil, fmt.Errorf("build tar: %w", err)
		}
		if err := c.docker.CopyToContainer(ctx, containerID, cfg.WorkingDir, tarBuf, container.CopyToContainerOptions{}); err != nil {
			return nil, fmt.Errorf("copy to container: %w", err)
		}
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

// CreateInteractive creates a persistent container for terminal sessions.
func (c *Client) CreateInteractive(ctx context.Context, image string, shell []string) (string, error) {
	containerCfg := &container.Config{
		Image:       image,
		Cmd:         shell,
		Tty:         true,
		OpenStdin:   true,
		AttachStdin: true,
	}
	hostCfg := &container.HostConfig{
		NetworkMode: "none",
		Resources: container.Resources{
			Memory:   256 << 20, // 256 MB
			CPUQuota: 100000,    // 1 CPU
		},
	}

	resp, err := c.docker.ContainerCreate(ctx, containerCfg, hostCfg, nil, nil, "")
	if err != nil {
		return "", fmt.Errorf("create interactive container: %w", err)
	}

	if err := c.docker.ContainerStart(ctx, resp.ID, container.StartOptions{}); err != nil {
		c.docker.ContainerRemove(ctx, resp.ID, container.RemoveOptions{Force: true})
		return "", fmt.Errorf("start interactive container: %w", err)
	}

	return resp.ID, nil
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
