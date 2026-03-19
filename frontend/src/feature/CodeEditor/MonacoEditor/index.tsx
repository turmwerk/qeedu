import React, { useEffect, useMemo, useRef } from "react";
import Editor from "@monaco-editor/react";
import type { editor, IDisposable } from "monaco-editor";
// @ts-ignore
import "monaco-editor/esm/vs/editor/editor.all";
// @ts-ignore
import "monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution";
import { setupCompletion } from "@/feature/CodeEditor/CodeCompletion/CompletionController";

interface Props {
	value: string;
	onChange?: (value: string) => void;
	language?: string;
	readOnly?: boolean;
	height?: string | number;
	width?: string | number;
	minimap?: boolean;
	path?: string;
}

let themeDefined = false;
let foldingDefined = false;

const MonacoEditor: React.FC<Props> = ({
	value,
	onChange,
	language = "plaintext",
	readOnly = false,
	height = "100%",
	width = "100%",
	minimap = false,
	path,
}) => {
	const completionRef = useRef<IDisposable | null>(null);

	useEffect(() => {
		return () => {
			completionRef.current?.dispose();
			completionRef.current = null;
		};
	}, []);

	const options: editor.IStandaloneEditorConstructionOptions = useMemo(
		() => ({
			readOnly,
			minimap: { enabled: minimap },
			glyphMargin: false,
			fontSize: 13,
			lineHeight: 20,
			fontLigatures: true,
			fontFamily:
				"'Cascadia Code', 'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace",
			renderLineHighlight: "line",
			roundedSelection: false,
			scrollBeyondLastLine: false,
			smoothScrolling: true,
			cursorSmoothCaretAnimation: "on",
			cursorBlinking: "smooth" as const,
			cursorStyle: "line" as const,
			padding: { top: 10, bottom: 10 },
			renderWhitespace: "selection" as const,
			renderControlCharacters: false,
			folding: true,
			foldingStrategy: "auto",
			foldingHighlight: true,
			foldingImportsByDefault: true,
			showFoldingControls: "mouseover",
			stickyScroll: { enabled: true },
			wordWrap: "on",
			tabSize: 2,
			insertSpaces: true,
			formatOnPaste: true,
			formatOnType: true,
			automaticLayout: true,
			guides: { bracketPairs: true, highlightActiveBracketPair: true },
			bracketPairColorization: { enabled: true },
			scrollbar: {
				verticalScrollbarSize: 10,
				horizontalScrollbarSize: 10,
				verticalHasArrows: false,
				horizontalHasArrows: false,
			},
		}),
		[readOnly, minimap]
	);

	const handleMount = (editorInstance: editor.IStandaloneCodeEditor, monaco: typeof import("monaco-editor")) => {
		if (!themeDefined) {
			themeDefined = true;
			monaco.editor.defineTheme("vscode-dark-markdown", {
				base: "vs-dark",
				inherit: true,
				rules: [
					{ token: "strong", fontStyle: "bold", foreground: "C9D1FF" },
					{ token: "emphasis", fontStyle: "italic", foreground: "C9D1FF" },
					{ token: "string", foreground: "A5D6FF" },
					{ token: "keyword", foreground: "7AA2F7" },
					{ token: "number", foreground: "F2CC60" },
					{ token: "comment", foreground: "6B7280" },
				],
				colors: {
					"editor.background": "#0b1220",
					"editorLineNumber.foreground": "#6B7280",
					"editorLineNumber.activeForeground": "#CBD5F5",
					"editorIndentGuide.background": "#1F2937",
					"editorIndentGuide.activeBackground": "#374151",
				},
			});
		}
		monaco.editor.setTheme("vscode-dark-markdown");

		if (!foldingDefined) {
			foldingDefined = true;
			monaco.languages.registerFoldingRangeProvider("markdown", {
				provideFoldingRanges: (model, _context, _token) => {
					const lines = model.getLinesContent();
					const ranges: { start: number; end: number; kind?: any }[] = [];
					const headerStack: { line: number; level: number }[] = [];
					let codeBlockStart = -1;

					// Indentation folding states
					const indentStack: { marker: number; level: number }[] = [];
					let prevIndentLevel = 0;
					let lastNonEmptyLine = -1;

					for (let i = 0; i < lines.length; i++) {
						const line = lines[i];
						const lineNo = i + 1;
						const trimmed = line.trim();

						// --- 1. Indentation Logic ---
						const isNotEmpty = trimmed.length > 0;
						if (isNotEmpty) {
							const indent = line.match(/^\s*/)?.[0].length ?? 0;
							
							if (indent > prevIndentLevel) {
								// Indent increased: The last non-empty line is a parent
								if (lastNonEmptyLine !== -1) {
									indentStack.push({ marker: lastNonEmptyLine, level: prevIndentLevel });
								}
							} else if (indent < prevIndentLevel) {
								// Indent decreased: Close blocks
								while (indentStack.length > 0 && indentStack[indentStack.length - 1].level >= indent) {
									const parent = indentStack.pop();
									if (parent) {
										ranges.push({
											start: parent.marker,
											end: lastNonEmptyLine,
											kind: monaco.languages.FoldingRangeKind.Region
										});
									}
								}
							}
							prevIndentLevel = indent;
							lastNonEmptyLine = lineNo;
						}

						// --- 2. Syntax Logic (Headers & Code Blocks) ---
						
						// Code blocks
						if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
							if (codeBlockStart === -1) {
								codeBlockStart = lineNo;
							} else {
								ranges.push({
									start: codeBlockStart,
									end: lineNo,
									kind: monaco.languages.FoldingRangeKind.Region,
								});
								codeBlockStart = -1;
							}
							continue;
						}

						if (codeBlockStart !== -1) continue;

						// Headers
						const headerMatch = line.match(/^(#{1,6})\s/);
						if (headerMatch) {
							const level = headerMatch[1].length;
							while (
								headerStack.length > 0 &&
								headerStack[headerStack.length - 1].level >= level
							) {
								const last = headerStack.pop();
								if (last && last.line < lineNo - 1) {
									ranges.push({
										start: last.line,
										end: lineNo - 1,
										kind: monaco.languages.FoldingRangeKind.Region,
									});
								}
							}
							headerStack.push({ line: lineNo, level });
						}
					}

					// Close remaining headers
					const endLine = lines.length;
					while (headerStack.length > 0) {
						const last = headerStack.pop();
						if (last && last.line < endLine) {
							ranges.push({
								start: last.line,
								end: endLine,
								kind: monaco.languages.FoldingRangeKind.Region,
							});
						}
					}

					// Close remaining indent blocks
					while (indentStack.length > 0) {
						const parent = indentStack.pop();
						if (parent && lastNonEmptyLine > parent.marker) {
							ranges.push({
								start: parent.marker,
								end: lastNonEmptyLine,
								kind: monaco.languages.FoldingRangeKind.Region
							});
						}
					}

					return ranges;
				},
			});
		}

		// Set up code completion
		completionRef.current?.dispose();
		completionRef.current = setupCompletion(editorInstance, monaco, language);
	};

	return (
		<Editor
			height={height}
			width={width}
			value={value}
			language={language}
			theme="vscode-dark-markdown"
			options={options}
			path={path}
			onMount={handleMount}
			onChange={(next) => onChange?.(next ?? "")}
		/>
	);
};

export default MonacoEditor;
