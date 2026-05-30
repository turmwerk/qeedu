import type { editor, languages, IDisposable, CancellationToken, Position } from "monaco-editor";
import { CompletionMode } from "./types";
import { useCompletionStore } from "./completionStore";
import { createLspCompletionDisposable } from "./LSPCompletion/provider";
import { apiUrl } from "@/api/config";

const DEBOUNCE_MS = 500;

async function fetchCompletion(
	language: string,
	fileContent: string,
	cursorOffset: number,
	filePath: string,
	signal: AbortSignal,
): Promise<string> {
	const res = await fetch(apiUrl("/ai/complete"), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			language,
			file_content: fileContent,
			cursor_offset: cursorOffset,
			file_path: filePath,
		}),
		credentials: "include",
		signal,
	});
	if (!res.ok) return "";
	const data = await res.json();
	return data.suggestion ?? "";
}

function createInlineProvider(
	language: string,
): languages.InlineCompletionsProvider {
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	return {
		provideInlineCompletions: async (
			model: editor.ITextModel,
			position: Position,
			_context: languages.InlineCompletionContext,
			token: CancellationToken,
		): Promise<languages.InlineCompletions> => {
			// Debounce
			if (debounceTimer) clearTimeout(debounceTimer);

			const result = await new Promise<languages.InlineCompletions>((resolve) => {
				debounceTimer = setTimeout(async () => {
					if (token.isCancellationRequested) {
						resolve({ items: [] });
						return;
					}

					const fileContent = model.getValue();
					const cursorOffset = model.getOffsetAt(position);
					const filePath = model.uri.path;

					const abortController = new AbortController();
					const onCancel = () => abortController.abort();
					token.onCancellationRequested(onCancel);

					try {
						const suggestion = await fetchCompletion(
							language,
							fileContent,
							cursorOffset,
							filePath,
							abortController.signal,
						);

						if (!suggestion || token.isCancellationRequested) {
							resolve({ items: [] });
							return;
						}

						resolve({
							items: [
								{
									insertText: suggestion,
									range: {
										startLineNumber: position.lineNumber,
										startColumn: position.column,
										endLineNumber: position.lineNumber,
										endColumn: position.column,
									},
								},
							],
						});
					} catch {
						resolve({ items: [] });
					}
				}, DEBOUNCE_MS);
			});

			return result;
		},
		disposeInlineCompletions: () => {},
	};
}

/**
 * Set up code completion for a Monaco editor instance.
 * Returns a dispose function that cleans up all registrations and subscriptions.
 */
export function setupCompletion(
	editorInstance: editor.IStandaloneCodeEditor,
	monaco: typeof import("monaco-editor"),
	options: {
		language: string;
		path?: string;
	},
): IDisposable {
	let inlineProviderDisposable: IDisposable | null = null;
	let completionProviderDisposable: IDisposable | null = null;

	function applyMode(mode: CompletionMode) {
		// Dispose previous inline provider
		inlineProviderDisposable?.dispose();
		inlineProviderDisposable = null;
		completionProviderDisposable?.dispose();
		completionProviderDisposable = null;

		const shouldEnableWordBased = mode !== CompletionMode.NONE;

		editorInstance.updateOptions({
			wordBasedSuggestions: shouldEnableWordBased ? "currentDocument" : "off",
			quickSuggestions: shouldEnableWordBased
				? { other: "on", comments: "off", strings: "off" }
				: false,
			inlineSuggest: { enabled: mode === CompletionMode.AI },
		});

		if (mode === CompletionMode.AI) {
			const provider = createInlineProvider(options.language);
			inlineProviderDisposable =
				monaco.languages.registerInlineCompletionsProvider(options.language, provider);
		}

		if (mode === CompletionMode.ADVANCED) {
			completionProviderDisposable = createLspCompletionDisposable(
				monaco,
				editorInstance,
				options.language,
				options.path,
			);
		}
	}

	// Apply initial mode
	applyMode(useCompletionStore.getState().mode);

	// Subscribe to mode changes
	const unsubscribe = useCompletionStore.subscribe((state) => {
		applyMode(state.mode);
	});

	return {
		dispose: () => {
			unsubscribe();
			inlineProviderDisposable?.dispose();
			inlineProviderDisposable = null;
			completionProviderDisposable?.dispose();
			completionProviderDisposable = null;
		},
	};
}
