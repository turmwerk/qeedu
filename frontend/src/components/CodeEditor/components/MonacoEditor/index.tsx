import React, { useMemo } from "react";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";

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
	const options: editor.IStandaloneEditorConstructionOptions = useMemo(
		() => ({
			readOnly,
			minimap: { enabled: minimap },
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

	return (
		<Editor
			height={height}
			width={width}
			value={value}
			language={language}
			theme="vs-dark"
			options={options}
			path={path}
			onChange={(next) => onChange?.(next ?? "")}
		/>
	);
};

export default MonacoEditor;
