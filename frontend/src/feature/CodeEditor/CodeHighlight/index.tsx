import React, { useMemo } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-yaml";

interface Props {
	value: string;
	language?: string;
	height?: string | number;
}

const CodeSnippet: React.FC<Props> = ({
	value,
	language = "plaintext",
	height = "100%",
}) => {
	const { html, lines } = useMemo(() => {
		const lang = Prism.languages[language] ?? Prism.languages.markup;
		const highlighted = Prism.highlight(value, lang, language);
		const lineCount = value.split("\n").length || 1;
		return { html: highlighted, lines: lineCount };
	}, [value, language]);

	return (
		<div
			className="relative h-full w-full overflow-hidden bg-[#0b1220]"
			style={{ height }}
			data-oid="code-snippet-root"
		>
			<style>{`
				.token.comment,.token.prolog,.token.doctype,.token.cdata{color:#6b7280}
				.token.punctuation{color:#94a3b8}
				.token.property,.token.tag,.token.boolean,.token.number,.token.constant,.token.symbol,.token.deleted{color:#f472b6}
				.token.selector,.token.attr-name,.token.string,.token.char,.token.builtin,.token.inserted{color:#34d399}
				.token.operator,.token.entity,.token.url,.language-css .token.string,.style .token.string{color:#facc15}
				.token.atrule,.token.attr-value,.token.keyword{color:#60a5fa}
				.token.function,.token.class-name{color:#a78bfa}
				.token.regex,.token.important,.token.variable{color:#fb7185}
			`}</style>
			<div className="flex h-full overflow-hidden text-[13px] leading-[20px]">
				<div className="select-none border-r border-[#1f2937] bg-[#0b1220] px-3 py-3 text-right text-slate-500">
					{Array.from({ length: lines }).map((_, index) => (
						<div key={index}>{index + 1}</div>
					))}
				</div>
				<pre className="m-0 flex-1 overflow-auto px-4 py-3 text-slate-100">
					<code
						className={`language-${language}`}
						dangerouslySetInnerHTML={{ __html: html }}
					/>
				</pre>
			</div>
		</div>
	);
};

export default CodeSnippet;
