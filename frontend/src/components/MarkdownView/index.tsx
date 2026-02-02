import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";
import "github-markdown-css/github-markdown-light.css";

export const Markdown: React.FC<{
  value?: string;
}> = ({ value = "" }) => {
  return (
    <div
      className="markdown-view border-0 p-0 h-full box-border bg-transparent min-h-0 flex flex-col"
      data-oid="e0jucw2"
    >
      <style data-oid="ghf.b4-">{`
        .markdown-view .content {
          height: 100%;
          overflow: auto;
          box-sizing: border-box;
          padding: 16px 18px;
        }
        .markdown-view .markdown-body {
          background: transparent;
        }
      `}</style>
        <div className="content h-full overflow-y-auto" data-oid="f6t.rff">
        <div className="markdown-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            // @ts-expect-error
            rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight]}
          >
            {value}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Markdown;
