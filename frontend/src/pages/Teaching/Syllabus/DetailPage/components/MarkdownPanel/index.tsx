import React from "react";
import MarkdownEditor from "@/components/MarkdownEditor";
import MarkdownView from "@/components/MarkdownView";

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
    <div className="flex-1 min-h-0 overflow-hidden p-4 flex flex-col">
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
