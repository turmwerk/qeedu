import React, { useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface MarkdownMessageProps {
  text: string;
}

const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ text }) => {
  // Normalize: strip leading/trailing whitespace from code-fence content
  // that the model sometimes prepends with a stray newline.
  const normalized = useMemo(() => {
    return text
      // Remove leading newline immediately after code-fence open.
      .replace(/(```\w*)\n+/g, "$1\n")
      // Remove trailing newline before code-fence close.
      .replace(/\n+(```)/g, "\n$1");
  }, [text]);

  const components: Components = {
    p: ({ children }) => (
      <p className="mb-3 leading-relaxed last:mb-0">{children}</p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-[#2563eb] underline-offset-2 hover:underline"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mb-3 border-l-2 border-[#d0d0d0] pl-3 text-[#4b5563]">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="mb-3 w-full overflow-x-auto">
        <table className="w-full border-collapse text-[12px]">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-[#e5e7eb] bg-[#f3f4f6] px-2 py-1 text-left font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-[#e5e7eb] px-2 py-1">{children}</td>
    ),
    pre: ({ children }) => (
      <pre className="mb-3 overflow-x-auto rounded-lg bg-[#111827] p-3 text-[12px] text-[#e5e7eb]">
        {children}
      </pre>
    ),
    code: ({ children, className }) => {
      const isInline = !className;
      return isInline ? (
        <code className="rounded bg-[#e5e7eb] px-1 py-0.5 text-[12px] text-[#111827]">
          {children}
        </code>
      ) : (
        <code className={className}>{children}</code>
      );
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      skipHtml
      components={components}
    >
      {normalized}
    </ReactMarkdown>
  );
};

export default MarkdownMessage;
