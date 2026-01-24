import React, { useId, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";
import "github-markdown-css/github-markdown-light.css";
import Button from "@/components/Button";
import CodeEditor from "@/components/CodeEditor";

export const Markdown: React.FC<{
  value?: string;
  onChange?: (v: string) => void;
  onFullScreen?: () => void;
  showControls?: boolean;
}> = ({ value = "", onChange, onFullScreen, showControls = true }) => {
  const [showRaw, setShowRaw] = useState(false);

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
        .markdown-view .empty { color: #94a3b8; }
      `}</style>
      {showControls && (
        <div className="flex justify-end gap-2 pt-3 pb-2" data-oid="4l:pe-u">
          <Button
            className="bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-xl font-semibold transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)] active:translate-y-[1px] active:scale-[0.98]"
            onClick={() => setShowRaw((v) => !v)}
            data-oid="-cwnu.l"
          >
            {showRaw ? "渲染 Markdown" : "显示 Markdown"}
          </Button>
          {onFullScreen && (
            <Button
              className="bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-xl font-semibold transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)] active:translate-y-[1px] active:scale-[0.98]"
              onClick={onFullScreen}
              data-oid="4umb1l1"
            >
              全屏编辑
            </Button>
          )}
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-hidden relative" data-oid="cclwx20">
        <div
          className={`absolute inset-0 transition-all duration-300 ease-out ${
            showRaw ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
          }`}
        >
          {onChange ? (
            <CodeEditor
              value={value}
              onChange={onChange}
              language="markdown"
              minimap={false}
              showHeader={false}
              className="h-full w-full rounded-md border border-[var(--brand-border)]"
              data-oid="1fida20"
            />
          ) : (
            <CodeEditor
              value={value}
              language="markdown"
              readOnly
              variant="snippet"
              minimap={false}
              showHeader={false}
              className="h-full w-full rounded-md border border-[var(--brand-border)]"
              data-oid="fw9vofw"
            />
          )}
        </div>
        <div
          className={`absolute inset-0 transition-all duration-300 ease-out ${
            !showRaw && value ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
          }`}
        >
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
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            !showRaw && !value ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="empty" data-oid="xxehnqg">
            空的 Markdown
          </div>
        </div>
      </div>
    </div>
  );
};

export const SplitSiderLayout: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
  initialSplit?: number;
  minSplit?: number;
  maxSplit?: number;
  className?: string;
  leftClassName?: string;
  rightClassName?: string;
} & React.HTMLAttributes<HTMLDivElement>> = ({
  left,
  right,
  initialSplit = 68,
  minSplit = 40,
  maxSplit = 80,
  className,
  leftClassName,
  rightClassName,
  ...rest
}) => {
  const [split, setSplit] = useState(initialSplit);
  const isDragging = useRef(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const layoutId = useId().replace(/[:]/g, "");
  const layoutClass = `split-layout-${layoutId}`;

  const startDrag = () => {
    isDragging.current = true;
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

  const onDrag = (clientX: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.min(maxSplit, Math.max(minSplit, next));
    setSplit(clamped);
  };

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    onDrag(event.clientX);
  };

  const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    onDrag(event.touches[0].clientX);
  };

  const columns = useMemo(() => `${split}% 6px ${100 - split}%`, [split]);

  return (
    <>
      <style data-oid="split:cols">{`.${layoutClass} { grid-template-columns: ${columns}; }`}</style>
      <div
        ref={wrapRef}
        className={`grid items-stretch gap-0 flex-1 min-h-0 overflow-hidden h-full ${layoutClass} ${className || ""}`}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchMove={onTouchMove}
        onTouchEnd={stopDrag}
        {...rest}
      >
      <div
        className={
          leftClassName || "flex flex-col h-full min-h-0 overflow-hidden"
        }
      >
        {left}
      </div>

      <div
        className="relative"
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        role="separator"
        aria-label="Resize panes"
        aria-orientation="vertical"
        data-oid="g75ffu_"
      >
        <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-[2px] rounded-full bg-purple-300/70" />
        <div className="absolute inset-0 cursor-col-resize" />
      </div>

      <div
        className={
          rightClassName || "flex flex-col h-full min-h-0 overflow-hidden"
        }
      >
        {right}
      </div>
      </div>
    </>
  );
};

export default Markdown;
