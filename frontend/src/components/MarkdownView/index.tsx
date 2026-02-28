                                                                                                                                                    import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import CopyButton from "./components/CopyButton";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";
import "github-markdown-css/github-markdown-light.css";
import "@/styles/markdown/index.scss";

/** 递归提取 React 节点树中的纯文本（用于代码块复制） */
function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node)) {
    return extractText(
      (node.props as { children?: React.ReactNode }).children,
    );
  }
  return "";
}

const markdownComponents: Components = {
  // 为每个代码块添加圆角包裹层 + Copy 按钮
  pre({ children, ...props }) {
    const codeChild = React.Children.toArray(children).find(
      (c): c is React.ReactElement => React.isValidElement(c),
    );
    const codeText = codeChild
      ? extractText(
          (codeChild.props as { children?: React.ReactNode }).children,
        )
      : "";

    return (
      <div className="relative group my-4 rounded-xl overflow-hidden">
        <pre {...props} className="!my-0 !rounded-none">
          {children}
        </pre>
        <CopyButton text={codeText} />
      </div>
    );
  },
};

export const Markdown: React.FC<{
  value?: string;
}> = ({ value = "" }) => {
  return (
    <div className="markdown-view">
      <div className="content">
        <div className="markdown-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            // @ts-expect-error rehype plugin tuple typing is narrower than runtime-compatible plugins
            rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight]}
            components={markdownComponents}
          >
            {value}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Markdown;
