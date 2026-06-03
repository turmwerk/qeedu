import { apiUrl } from "./config";

export interface ChatMessage {
	role: "user" | "assistant";
	content: string;
}

export type ChatMode = "agent" | "ask" | "plan";

export interface ChatStreamOptions {
	messages: ChatMessage[];
	file_context?: string;
	language?: string;
	mode?: ChatMode;
	model?: string;
	api_key?: string;
	base_url?: string;
	temperature?: number;
	max_tokens?: number;
	onDelta: (text: string) => void;
	onDone: () => void;
	onError: (err: string) => void;
}

export interface CustomChatStreamOptions extends ChatStreamOptions {
	endpoint: string;
	extraBody?: Record<string, unknown>;
}

type StreamPayload =
	| { kind: "delta"; text: string }
	| { kind: "done" }
	| { kind: "error"; error: string };

function parseStreamPayload(payload: string): StreamPayload {
	if (payload === "[DONE]") return { kind: "done" };
	if (payload.startsWith("[ERROR]")) return { kind: "error", error: payload.slice(8).trim() };

	try {
		const parsed = JSON.parse(payload) as unknown;
		if (parsed && typeof parsed === "object") {
			const record = parsed as Record<string, unknown>;
			if (record.done === true) return { kind: "done" };
			if (typeof record.error === "string") return { kind: "error", error: record.error };
			if (typeof record.delta === "string") return { kind: "delta", text: record.delta };
		}
	} catch {}

	return { kind: "delta", text: payload };
}

function handleStreamPayload(
	payload: string,
	onDelta: (text: string) => void,
	onDone: () => void,
	onError: (err: string) => void,
): boolean {
	const parsed = parseStreamPayload(payload);
	if (parsed.kind === "done") {
		onDone();
		return true;
	}
	if (parsed.kind === "error") {
		onError(parsed.error);
		return true;
	}
	onDelta(parsed.text);
	return false;
}

export interface CompleteRequest {
	language: string;
	file_content: string;
	cursor_offset: number;
	file_path: string;
	model?: string;
	api_key?: string;
	base_url?: string;
	temperature?: number;
	max_tokens?: number;
}

export interface CompleteResponse {
	suggestion: string;
}

function jsonHeaders(): Record<string, string> {
	return { "Content-Type": "application/json" };
}

function createStreamRequest(
	endpoint: string,
	body: Record<string, unknown>,
	onDelta: (text: string) => void,
	onDone: () => void,
	onError: (err: string) => void,
): AbortController {
	const controller = new AbortController();
	const MAX_RETRIES = 2;

	(async () => {
		for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
			try {
				const res = await fetch(apiUrl(endpoint), {
					method: "POST",
					headers: jsonHeaders(),
					body: JSON.stringify(body),
					signal: controller.signal,
					credentials: "include",
				});

				if (!res.ok || !res.body) {
					if (res.status >= 500 && attempt < MAX_RETRIES) {
						await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
						continue;
					}
					onError(`HTTP ${res.status}`);
					return;
				}

				const reader = res.body.getReader();
				const decoder = new TextDecoder();
				let buffer = "";

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					buffer += decoder.decode(value, { stream: true });
					const lines = buffer.split("\n");
					buffer = lines.pop() ?? "";

					for (const line of lines) {
						if (!line.startsWith("data: ")) continue;
						const payload = line.slice(6).replace(/\r$/, "");
						if (handleStreamPayload(payload, onDelta, onDone, onError)) return;
					}
				}
				onDone();
				return;
			} catch (err: unknown) {
				if (err instanceof DOMException && err.name === "AbortError") return;
				if (attempt < MAX_RETRIES) {
					await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
					continue;
				}
				onError(String(err));
			}
		}
	})();

	return controller;
}

export function chatStream(options: ChatStreamOptions): AbortController {
	const { messages, file_context, language, mode, model, api_key, base_url, temperature, max_tokens, onDelta, onDone, onError } = options;
	return createStreamRequest(
		"/ai/chat",
		{ messages, file_context, language, mode, model: model || undefined, api_key: api_key || undefined, base_url: base_url || undefined, temperature, max_tokens },
		onDelta,
		onDone,
		onError,
	);
}

export function customChatStream(options: CustomChatStreamOptions): AbortController {
	const { endpoint, messages, file_context, language, mode, model, api_key, base_url, temperature, max_tokens, extraBody, onDelta, onDone, onError } = options;
	return createStreamRequest(
		endpoint,
		{ messages, file_context, language, mode, model: model || undefined, api_key: api_key || undefined, base_url: base_url || undefined, temperature, max_tokens, ...(extraBody ?? {}) },
		onDelta,
		onDone,
		onError,
	);
}

export async function complete(req: CompleteRequest): Promise<CompleteResponse> {
	const res = await fetch(apiUrl("/ai/complete"), {
		method: "POST",
		headers: jsonHeaders(),
		body: JSON.stringify(req),
		credentials: "include",
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return res.json();
}

export interface FixBugStreamOptions {
	code: string;
	error_message: string;
	language: string;
	model?: string;
	api_key?: string;
	base_url?: string;
	temperature?: number;
	max_tokens?: number;
	onDelta: (text: string) => void;
	onDone: () => void;
	onError: (err: string) => void;
}

export function fixBugStream(options: FixBugStreamOptions): AbortController {
	const { code, error_message, language, model, api_key, base_url, temperature, max_tokens, onDelta, onDone, onError } = options;
	return createStreamRequest(
		"/ai/fix",
		{ code, error_message, language, model: model || undefined, api_key: api_key || undefined, base_url: base_url || undefined, temperature, max_tokens },
		onDelta,
		onDone,
		onError,
	);
}

/** Available model metadata. */
export interface ModelInfo {
	id: string;
	name: string;
	provider: string;
}

/** GET /api/v1/ai/models response. */
export interface ModelsResponse {
	models: ModelInfo[];
	current: {
		chat: string;
		fix: string;
		copilot: string;
	};
}

/** Fetch available models and current selection. */
export async function getModels(): Promise<ModelsResponse> {
	const res = await fetch(apiUrl("/ai/models"), { credentials: "include" });
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return res.json();
}
