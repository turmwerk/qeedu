import React from "react";
import TemplateWorkbench from "@/feature/RecordWorkspace/TemplateWorkbench";
import { writingDeskQuickActions, writingDeskRecords } from "@/pages/International/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";
import {
  workbenchMainPanelShellClassName,
  workbenchScrollAreaClassName,
} from "@/pages/shared/workbench";

type WritingDeskRecord = (typeof writingDeskRecords)[number];

type Props = {
  records: WritingDeskRecord[];
  selected: WritingDeskRecord | null;
  draftText: string;
  onOpenRecord: (recordId: string) => void;
  onDraftChange: (value: string) => void;
  onSave: () => void;
  onAppendContent: (content: string, replace?: boolean) => void;
};

const MainPanel: React.FC<Props> = ({
  records,
  selected,
  draftText,
  onOpenRecord,
  onDraftChange,
  onSave,
  onAppendContent,
}) => (
  <div className={workbenchMainPanelShellClassName}>
    <div className={workbenchScrollAreaClassName}>
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">History Rail</div>
            <div className="mt-4 space-y-3">
              {records.map((record) => (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => onOpenRecord(record.id)}
                  className={`w-full rounded-[22px] border px-4 py-4 text-left ${
                    selected?.id === record.id
                      ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white/10"
                      : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5"
                  }`}
                >
                  <div className="text-sm font-bold">{record.title}</div>
                  <div className={`mt-2 text-xs ${selected?.id === record.id ? "text-slate-200" : "text-slate-500 dark:text-slate-300"}`}>{record.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Draft Preview</div>
                  <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                    {selected?.title ?? "暂无草稿"}
                  </div>
                </div>
                <div className="flex gap-2">
                  {writingDeskQuickActions.map((item) => (
                    <Button
                      key={item.id}
                      variant="secondary"
                      size="sm"
                      onClick={() => showToast(`${item.title} 已触发`)}
                    >
                      {item.title}
                    </Button>
                  ))}
                  <Button variant="primary" onClick={onSave}>
                    保存草稿
                  </Button>
                </div>
              </div>
              <textarea
                value={draftText}
                onChange={(event) => onDraftChange(event.target.value)}
                className="min-h-[420px] w-full rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-100"
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.96fr)]">
              <TemplateWorkbench templates={selected?.templates ?? []} onInsert={onAppendContent} />
              <div className="workbench-surface-accent rounded-[28px] border border-amber-200/70 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.98)_0%,rgba(255,247,237,0.96)_34%,rgba(224,242,254,0.94)_100%)] p-5 shadow-[0_20px_48px_rgba(251,191,36,0.12)]">
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-amber-600/80">Send Check</div>
                <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">发送前检查</div>
                <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  模板、 opening、closing 和附件提示都留在左侧写作区里，不再把辅助卡片堆到右栏，右边只负责持续对话润色。
                </div>
                <div className="mt-4 grid gap-3">
                  {["检查称呼与 opening", "核对双语一致性", "补发送附件说明"].map((label) => (
                    <Button
                      key={label}
                      variant="secondary"
                      className="justify-start"
                      onClick={() => showToast(`${label} 已完成`)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MainPanel;
