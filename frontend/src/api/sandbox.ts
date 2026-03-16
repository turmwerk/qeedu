import http from "./http";

export interface RunCodeRequest {
  language: string;
  code: string;
  stdin?: string;
  timeout_seconds?: number;
}

export interface RunCodeResponse {
  stdout: string;
  stderr: string;
  exit_code: number;
  execution_ms: number;
  error: string;
}

export interface ExecCommandRequest {
  command: string;
  shell?: string;
  working_dir?: string;
  timeout_seconds?: number;
}

export interface ExecCommandResponse {
  stdout: string;
  stderr: string;
  exit_code: number;
}

export async function runCode(req: RunCodeRequest): Promise<RunCodeResponse> {
  const { data } = await http.post<RunCodeResponse>("/sandbox/run", req);
  return data;
}

export async function execCommand(
  req: ExecCommandRequest,
): Promise<ExecCommandResponse> {
  const { data } = await http.post<ExecCommandResponse>("/sandbox/exec", req);
  return data;
}

/**
 * Build the WebSocket URL for an interactive terminal session.
 * Reuses the JWT token from localStorage for auth.
 */
export function buildTerminalWsUrl(shell = "bash"): string {
  const token = localStorage.getItem("token") ?? "";
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  return `${proto}//${host}/api/v1/sandbox/terminal/ws?shell=${encodeURIComponent(shell)}&token=${encodeURIComponent(token)}`;
}
