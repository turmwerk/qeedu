import React, { useState } from "react";
import MarkdownIt from "markdown-it";
import mk from "markdown-it-katex";
import hljs from "highlight.js";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang }).value +
          "</code></pre>"
        );
      } catch (__) {}
    }
    return (
      '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
    );
  },
}).use(mk as any);

export const Markdown: React.FC<{
  value?: string;
  onChange?: (v: string) => void;
  onFullScreen?: () => void;
  showControls?: boolean;
}> = ({ value = "", onChange, onFullScreen, showControls = true }) => {
  const [showRaw, setShowRaw] = useState(false);
  let html = value ? md.render(value) : "";
  // 用正则为所有.katex外层加.katex-isolate类
  html = html.replace(/class="katex(?!-)/g, 'class="katex katex-isolate');

  return (
    <div
      className="markdown-view border-0 p-0 h-full box-border bg-transparent min-h-0 flex flex-col"
      data-oid="e0jucw2"
    >
      <style data-oid="ghf.b4-">{`
                          .markdown-view .katex, .markdown-view .katex * {
                            font-family: 'KaTeX_Main', 'Times New Roman', Times, serif !important;
                            line-height: 1.2 !important;
                            vertical-align: baseline !important;
                          }
                          .markdown-view .katex { overflow: visible !important; }
                          .markdown-view .content { color: var(--brand-text); line-height: 1.8; padding: 0; height: 100%; overflow: auto; box-sizing: border-box; }
                          .markdown-view .content h1 { font-size: 20px; margin: 0 0 12px 0; }
                          .markdown-view .content h2 { font-size: 18px; margin: 24px 0 16px 0; font-weight: 700; color: var(--brand-text); border-left: 4px solid var(--brand-accent); padding-left: 10px; line-height: 1.4; }
                          .markdown-view .content table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; }
                          .markdown-view .content th, .markdown-view .content td { border: 1px solid var(--brand-border); padding: 10px 12px; text-align: left; line-height: 1.5; color: var(--brand-text); white-space: pre-wrap; }
                          .markdown-view .content th { background-color: var(--brand-accent-soft); font-weight: 600; }
                          .markdown-view .content table td:nth-child(1),
                          .markdown-view .content table td:nth-child(3) { background-color: var(--brand-accent-soft); font-weight: 600; }
                          .markdown-view .content td strong { display: block; font-weight: 600; color: var(--brand-text); }
                          .markdown-view .content ul { padding-left: 20px; }
                          .markdown-view .content p { margin: 6px 0 10px 0; }
                          .markdown-view .content pre { background: transparent; padding: 8px; }
                          .markdown-view .content .katex { display: inline-block; line-height: normal; vertical-align: middle; font-family: 'KaTeX_Main', 'Times New Roman', Times, serif !important; font-style: normal !important; font-weight: normal !important; font-size: 1em !important; }
                          .markdown-view .content .katex-display { display: flex; justify-content: center; align-items: center; text-align: center; margin: 18px 0; width: 100%; }
                          .markdown-view .content .katex .katex-html { display: inline-block; }
                          .markdown-view .content > .katex-display, .markdown-view .content .katex-display > .katex { margin-left: auto !important; margin-right: auto !important; }
                          .markdown-view .content .katex svg { transform: none !important; }
                          .markdown-view .content .katex .vlist { position: relative !important; top: -0.22em !important; }
                          .markdown-view .content .katex .baseline-fix { display: none !important; }
                          .markdown-view .pre { white-space: pre-wrap; word-break: break-word; margin: 0; color: #3b3350; }
                          .markdown-view .empty { color: #888; }
                                                    @keyframes fadeSlide { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
                                                    .fade-slide { animation: fadeSlide 0.24s ease; }
                        `}</style>
      {showControls && (
        <div className="flex justify-end gap-2 pt-3 pb-2" data-oid="4l:pe-u">
          <button
            className="bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-xl cursor-pointer font-semibold transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)] active:translate-y-[1px] active:scale-[0.98]"
            onClick={() => setShowRaw((v) => !v)}
            data-oid="-cwnu.l"
          >
            {showRaw ? "渲染 Markdown" : "显示 Markdown"}
          </button>
          {onFullScreen && (
            <button
              className="bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-xl cursor-pointer font-semibold transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)] active:translate-y-[1px] active:scale-[0.98]"
              onClick={onFullScreen}
              data-oid="4umb1l1"
            >
              全屏编辑
            </button>
          )}
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-hidden" data-oid="cclwx20">
        {showRaw ? (
          onChange ? (
            <textarea
              className="fade-slide w-full h-full box-border p-3 font-mono text-[13px] rounded-md border border-[var(--brand-border)] min-h-0 resize-y overflow-auto"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              aria-label="Markdown 编辑"
              data-oid="1fida20"
            />
          ) : (
            <pre
              className="fade-slide w-full h-full box-border p-3 font-mono text-[13px] rounded-md border border-[var(--brand-border)] min-h-0 resize-y overflow-auto"
              data-oid="fw9vofw"
            >
              {value}
            </pre>
          )
        ) : value ? (
          <div
            className="content fade-slide flex-1 min-h-0 overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: html }}
            data-oid="f6t.rff"
          />
        ) : (
          <div className="empty fade-slide" data-oid="xxehnqg">
            空的 Markdown
          </div>
        )}
      </div>
    </div>
  );
};

export default Markdown;
