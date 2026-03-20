export interface ChatMessage {
	role: "user" | "assistant";
	content: string;
}

export interface ChatStreamOptions {
	messages: ChatMessage[];
	file_context?: string;
	language?: string;
	onDelta: (text: string) => void;
	onDone: () => void;
	onError: (err: string) => void;
}

export interface CustomChatStreamOptions extends ChatStreamOptions {
	endpoint: string;
	extraBody?: Record<string, unknown>;
}

export interface CompleteRequest {
	language: string;
	file_content: string;
	cursor_offset: number;
	file_path: string;
}

export interface CompleteResponse {
	suggestion: string;
}

function getAuthHeaders(): Record<string, string> {
	const token = localStorage.getItem("token") ?? "";
	return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	};
}

/**
 * Stream a chat response from the backend using SSE (Server-Sent Events).
 * Returns an AbortController so the caller can cancel the request.
 */
function createStreamRequest(
	endpoint: string,
	body: Record<string, unknown>,
	onDelta: (text: string) => void,
	onDone: () => void,
	onError: (err: string) => void,
): AbortController {
	const controller = new AbortController();

	(async () => {
		try {
			const res = await fetch(endpoint, {
				method: "POST",
				headers: getAuthHeaders(),
				body: JSON.stringify(body),
				signal: controller.signal,
			});

			if (!res.ok || !res.body) {
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
					const payload = line.slice(6);
					if (payload === "[DONE]") {
						onDone();
						return;
					}
					if (payload.startsWith("[ERROR]")) {
						onError(payload.slice(8));
						return;
					}
					onDelta(payload);
				}
			}
			onDone();
		} catch (err: unknown) {
			if (err instanceof DOMException && err.name === "AbortError") return;
			onError(String(err));
		}
	})();

	return controller;
}

export function chatStream(options: ChatStreamOptions): AbortController {
	const { messages, file_context, language, onDelta, onDone, onError } = options;
	return createStreamRequest(
		"/api/v1/ai/chat",
		{ messages, file_context, language },
		onDelta,
		onDone,
		onError,
	);
}

export function customChatStream(options: CustomChatStreamOptions): AbortController {
	const { endpoint, messages, file_context, language, extraBody, onDelta, onDone, onError } = options;
	return createStreamRequest(
		endpoint,
		{ messages, file_context, language, ...(extraBody ?? {}) },
		onDelta,
		onDone,
		onError,
	);
}

/**
 * Request code completion (non-streaming).
 */
export async function complete(req: CompleteRequest): Promise<CompleteResponse> {
	const res = await fetch("/api/v1/ai/complete", {
		method: "POST",
		headers: getAuthHeaders(),
		body: JSON.stringify(req),
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	return res.json();
}

export interface FixBugStreamOptions {
	code: string;
	error_message: string;
	language: string;
	onDelta: (text: string) => void;
	onDone: () => void;
	onError: (err: string) => void;
}

/**
 * Stream a bug fix response from the backend using SSE.
 * Returns an AbortController for cancellation.
 */
export function fixBugStream(options: FixBugStreamOptions): AbortController {
	const { code, error_message, language, onDelta, onDone, onError } = options;
	const controller = new AbortController();

	(async () => {
		try {
			const res = await fetch("/api/v1/ai/fix", {
				method: "POST",
				headers: getAuthHeaders(),
				body: JSON.stringify({ code, error_message, language }),
				signal: controller.signal,
			});

			if (!res.ok || !res.body) {
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
					const payload = line.slice(6);
					if (payload === "[DONE]") {
						onDone();
						return;
					}
					if (payload.startsWith("[ERROR]")) {
						onError(payload.slice(8));
						return;
					}
					onDelta(payload);
				}
			}
			onDone();
		} catch (err: unknown) {
			if (err instanceof DOMException && err.name === "AbortError") return;
			onError(String(err));
		}
	})();

	return controller;
}
