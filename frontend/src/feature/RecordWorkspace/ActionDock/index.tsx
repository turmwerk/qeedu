import React from "react";
import Button from "@/ui/Button";
import type { WorkspaceQuickAction, WorkspaceTemplate } from "../types";

type Props = {
  actions: WorkspaceQuickAction[];
  templates: WorkspaceTemplate[];
  onInsert: (content: string, replace?: boolean) => void;
};

const ActionDock: React.FC<Props> = ({ actions, templates, onInsert }) => {
  const getTemplate = (templateId?: string) =>
    templates.find((template) => template.id === templateId);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      console.warn("clipboard unavailable");
    }
  };

  return (
    <div className="rounded-2xl bg-white/[0.88] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-[24px] dark:bg-white/[0.12]">
      <div className="mb-3">
        <div className="text-[16px] font-bold text-[var(--brand-blue)] dark:text-white">
          AI 快捷动作
        </div>
        <div className="text-sm text-[#6b7280] dark:text-[#d7e0ef]">
          常用的代理动作可以一键插入到正文，或者复制成提问模板。
        </div>
      </div>

      <div className="space-y-3">
        {actions.map((action) => (
          <div
            key={action.id}
            className="rounded-xl border border-[#dbeafe] bg-white/70 px-3 py-3 dark:border-white/10 dark:bg-white/5"
          >
            <div className="text-sm font-semibold text-[#1f2937] dark:text-white">
              {action.title}
            </div>
            {action.description && (
              <div className="mt-1 text-sm leading-6 text-[#6b7280] dark:text-[#d7e0ef]">
                {action.description}
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                className="rounded-xl border border-transparent bg-[#eff6ff] px-3 py-1.5 text-sm font-semibold text-[#2563eb] transition hover:border-[#93c5fd] hover:bg-[#dbeafe] dark:bg-white/10 dark:text-white"
                onClick={() => {
                  if (action.action === "append_prompt") {
                    onInsert(`\n\n## AI 代理动作\n${action.prompt}`, false);
                    return;
                  }
                  if (action.action === "append_template") {
                    const template = getTemplate(action.templateId);
                    if (template) onInsert(template.content, false);
                    return;
                  }
                  void copyText(action.prompt);
                }}
              >
                {action.action === "copy_prompt" ? "复制提示词" : "执行动作"}
              </Button>
              <Button
                className="rounded-xl border border-transparent bg-[#f8fafc] px-3 py-1.5 text-sm font-semibold text-[#475569] transition hover:border-[#cbd5e1] hover:bg-[#e2e8f0] dark:bg-white/10 dark:text-[#e2e8f0]"
                onClick={() => void copyText(action.prompt)}
              >
                复制内容
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionDock;