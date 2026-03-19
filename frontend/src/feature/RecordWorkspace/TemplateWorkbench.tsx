import React from "react";
import Button from "@/ui/Button";
import type { WorkspaceTemplate } from "./types";

type Props = {
  templates: WorkspaceTemplate[];
  onInsert: (content: string, replace?: boolean) => void;
};

const TemplateWorkbench: React.FC<Props> = ({ templates, onInsert }) => {
  return (
    <div className="rounded-2xl bg-white/[0.88] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-[24px] dark:bg-white/[0.12]">
      <div className="mb-3">
        <div className="text-[16px] font-bold text-[var(--brand-blue)] dark:text-white">
          模板工作台
        </div>
        <div className="text-sm text-[#6b7280] dark:text-[#d7e0ef]">
          直接把常用章节模板插入主编辑区，减少重复搭结构。
        </div>
      </div>

      <div className="space-y-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className="rounded-xl border border-[#dbeafe] bg-white/70 px-3 py-3 dark:border-white/10 dark:bg-white/5"
          >
            <div className="text-sm font-semibold text-[#1f2937] dark:text-white">
              {template.title}
            </div>
            {template.summary && (
              <div className="mt-1 text-sm leading-6 text-[#6b7280] dark:text-[#d7e0ef]">
                {template.summary}
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                className="rounded-xl border border-transparent bg-[#eff6ff] px-3 py-1.5 text-sm font-semibold text-[#2563eb] transition hover:border-[#93c5fd] hover:bg-[#dbeafe] dark:bg-white/10 dark:text-white"
                onClick={() => onInsert(template.content, false)}
              >
                追加到正文
              </Button>
              <Button
                className="rounded-xl border border-transparent bg-[#f8fafc] px-3 py-1.5 text-sm font-semibold text-[#475569] transition hover:border-[#cbd5e1] hover:bg-[#e2e8f0] dark:bg-white/10 dark:text-[#e2e8f0]"
                onClick={() => onInsert(template.content, true)}
              >
                替换当前正文
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateWorkbench;

