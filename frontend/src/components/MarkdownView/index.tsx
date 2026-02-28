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
      className="markdown-view border-0 p-0 h-full box-border bg-white dark:bg-[#1e293b] min-h-0 flex flex-col"
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
        [data-theme="dark"] .markdown-view .markdown-body {
          color: #e2e8f0;
        }
        [data-theme="dark"] .markdown-view .markdown-body h1,
        [data-theme="dark"] .markdown-view .markdown-body h2,
        [data-theme="dark"] .markdown-view .markdown-body h3,
        [data-theme="dark"] .markdown-view .markdown-body h4,
        [data-theme="dark"] .markdown-view .markdown-body h5,
        [data-theme="dark"] .markdown-view .markdown-body h6 {
          color: #f1f5f9;
          border-color: rgba(255,255,255,0.1);
        }
        [data-theme="dark"] .markdown-view .markdown-body table tr {
          background-color: transparent;
          border-color: rgba(255,255,255,0.1);
        }
        [data-theme="dark"] .markdown-view .markdown-body table td,
        [data-theme="dark"] .markdown-view .markdown-body table th {
          border-color: rgba(255,255,255,0.1);
        }
        [data-theme="dark"] .markdown-view .markdown-body hr {
          background-color: rgba(255,255,255,0.1);
        }
        [data-theme="dark"] .markdown-view .markdown-body blockquote {
          color: #94a3b8;
          border-color: rgba(255,255,255,0.15);
        }
        [data-theme="dark"] .markdown-view .markdown-body code {
          background: rgba(255,255,255,0.08);
          color: #e2e8f0;
        }
        [data-theme="dark"] .markdown-view .markdown-body a {
          color: #93c5fd;
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
