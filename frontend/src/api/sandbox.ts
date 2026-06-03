import http from "./http";

export interface RunCodeRequest {
  language: string;
  code: string;
  stdin?: string;
  timeout_seconds?: number;
  workspace_key?: string;
  files?: WorkspaceFilePayload[];
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

export interface WorkspaceFilePayload {
  path: string;
  content: string;
  language?: string;
}

export interface EnsureLspSessionRequest {
  workspace_key: string;
  language_group:
    | "go"
    | "python"
    | "typescript"
    | "java"
    | "cpp"
    | "rust"
    | "csharp";
  files: WorkspaceFilePayload[];
}

export interface EnsureLspSessionResponse {
  session_id: string;
}

export interface SyncLspFileRequest {
  file_path: string;
  content: string;
  version: number;
}

export interface LspDiagnostic {
  file_path: string;
  start_line: number;
  start_column: number;
  end_line: number;
  end_column: number;
  severity: number;
  source: string;
  message: string;
  code: string;
}

export interface GetLspDiagnosticsResponse {
  diagnostics: LspDiagnostic[];
}

export interface GetLspCompletionsRequest {
  file_path: string;
  line: number;
  column: number;
  version: number;
}

export interface LspCompletionItem {
  label: string;
  insert_text: string;
  detail: string;
  documentation: string;
  kind: string;
}

export interface GetLspCompletionsResponse {
  items: LspCompletionItem[];
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

export async function ensureLspSession(
  req: EnsureLspSessionRequest,
): Promise<EnsureLspSessionResponse> {
  const { data } = await http.post<EnsureLspSessionResponse>(
    "/sandbox/lsp/session",
    req,
  );
  return data;
}

export async function syncLspFile(
  sessionId: string,
  req: SyncLspFileRequest,
): Promise<void> {
  await http.patch(`/sandbox/lsp/session/${encodeURIComponent(sessionId)}/file`, req);
}

export async function getLspDiagnostics(
  sessionId: string,
): Promise<GetLspDiagnosticsResponse> {
  const { data } = await http.get<GetLspDiagnosticsResponse>(
    `/sandbox/lsp/session/${encodeURIComponent(sessionId)}/diagnostics`,
  );
  return data;
}

export async function getLspCompletions(
  sessionId: string,
  req: GetLspCompletionsRequest,
): Promise<GetLspCompletionsResponse> {
  const { data } = await http.post<GetLspCompletionsResponse>(
    `/sandbox/lsp/session/${encodeURIComponent(sessionId)}/completion`,
    req,
  );
  return data;
}

export async function destroyLspSession(sessionId: string): Promise<void> {
  await http.delete(`/sandbox/lsp/session/${encodeURIComponent(sessionId)}`);
}

/**
 * Build the WebSocket URL for an interactive terminal session.
 * Reuses the JWT token from localStorage for auth.
 */
export function buildTerminalWsUrl(shell = "bash"): string {
  const base = new URL(http.defaults.baseURL ?? "/api/v1", window.location.origin);
  const protocol = base.protocol === "https:" ? "wss:" : "ws:";
  const basePath = base.pathname.replace(/\/+$/, "");
  return `${protocol}//${base.host}${basePath}/sandbox/terminal/ws?shell=${encodeURIComponent(shell)}`;
}
