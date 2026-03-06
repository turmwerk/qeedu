import React, { useMemo } from "react";
import MonacoEditor from "@/feature/CodeEditor/MonacoEditor";
import CodeSnippet from "@/feature/CodeEditor/CodeSnippet";

export type CodeEditorVariant = "editor" | "snippet";

interface Props {
	value: string;
	onChange?: (value: string) => void;
	language?: string;
	readOnly?: boolean;
	height?: string | number;
	title?: string;
	actions?: React.ReactNode;
	variant?: CodeEditorVariant;
	minimap?: boolean;
	className?: string;
	showHeader?: boolean;
}

const CodeEditor: React.FC<Props> = ({
	value,
	onChange,
	language = "plaintext",
	readOnly = false,
	height = "100%",
	title,
	actions,
	variant = "editor",
	minimap = false,
	className = "",
	showHeader = true,
}) => {
	const headerTitle = useMemo(() => title ?? "Editor", [title]);

	return (
		<div
			className={`vscode-editor flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-[#1f2937] bg-[#0f172a] shadow-[0_12px_30px_rgba(15,23,42,0.35)] ${className}`}
			data-oid="code-editor-root"
		>
			{showHeader && (
				<div
					className="flex items-center justify-between gap-3 border-b border-[#1f2937] bg-gradient-to-r from-[#111827] via-[#0b1220] to-[#111827] px-4 py-2"
					data-oid="code-editor-header"
				>
					<div className="flex items-center gap-3">
						<span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#ef4444]" />
						<span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#f59e0b]" />
						<span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#22c55e]" />
						<div className="ml-2 text-sm font-semibold text-slate-200">
							{headerTitle}
						</div>
					</div>
					{actions && <div className="flex items-center gap-2">{actions}</div>}
				</div>
			)}

			<div className="flex-1 min-h-0 overflow-hidden" data-oid="code-editor-body">
				{variant === "snippet" ? (
					<CodeSnippet
						value={value}
						language={language}
						height={height}
					/>
				) : (
					<MonacoEditor
						value={value}
						onChange={onChange}
						language={language}
						readOnly={readOnly}
						height={height}
						minimap={minimap}
					/>
				)}
			</div>
		</div>
	);
};

export default CodeEditor;
