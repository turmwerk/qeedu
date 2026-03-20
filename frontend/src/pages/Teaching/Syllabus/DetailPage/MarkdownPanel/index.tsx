import React from "react";
import MarkdownEditor from "@/feature/MarkdownEditor";
import MarkdownView from "@/feature/MarkdownView";

type MarkdownPanelProps = {
  md: string;
  onChange: (next: string) => void;
  showRaw: boolean;
};

const MarkdownPanel: React.FC<MarkdownPanelProps> = ({
  md,
  onChange,
  showRaw,
}) => {
  return (
    <div className="flex-1 min-h-0 overflow-hidden p-4 flex flex-col rounded-xl bg-white/[0.88] dark:bg-white/[0.28] border-0 dark:border dark:border-white/[0.28] shadow-[0_8px_30px_rgba(120,90,200,0.14),inset_0_1px_0_rgba(255,255,255,0.74),inset_0_-1px_0_rgba(255,255,255,0.34)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(255,255,255,0.12)] backdrop-blur-[40px] backdrop-saturate-[210%]">
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <div
          className={`absolute inset-0 transition-all duration-300 ease-out ${
            showRaw ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
          }`}
        >
          <MarkdownEditor
            value={md}
            onChange={onChange}
            minimap={false}
            showHeader={false}
            className="h-full w-full rounded-md border border-[var(--brand-border)]"
          />
        </div>
        <div
          className={`absolute inset-0 transition-all duration-300 ease-out ${
            !showRaw && md ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
          }`}
        >
          <div className="h-full">
            <MarkdownView value={md} />
          </div>
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            !showRaw && !md ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="text-slate-400">空的 Markdown</div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownPanel;
