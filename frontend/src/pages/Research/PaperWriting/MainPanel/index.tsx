import React from "react";
import ActionDock from "@/feature/RecordWorkspace/ActionDock";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import TemplateWorkbench from "@/feature/RecordWorkspace/TemplateWorkbench";
import TimelinePanel from "@/feature/RecordWorkspace/TimelinePanel";
import type { WorkspaceQuickAction } from "@/feature/RecordWorkspace";
import { paperWritingRecords } from "@/pages/Research/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";
import {
  workbenchMainPanelShellClassName,
  workbenchScrollAreaClassName,
} from "@/pages/shared/workbench";

type PaperWritingRecord = (typeof paperWritingRecords)[number];

type Props = {
  records: PaperWritingRecord[];
  selected: PaperWritingRecord | null;
  editorText: string;
  quickActions: WorkspaceQuickAction[];
  onOpenRecord: (recordId: string) => void;
  onEditorChange: (value: string) => void;
  onSave: () => void;
  onAppendContent: (content: string, replace?: boolean) => void;
  onUpdateMilestone: (milestoneId: string, status: string) => void;
};

const MainPanel: React.FC<Props> = ({
  records,
  selected,
  editorText,
  quickActions,
  onOpenRecord,
  onEditorChange,
  onSave,
  onAppendContent,
  onUpdateMilestone,
}) => (
  <div className={workbenchMainPanelShellClassName}>
    <div className={workbenchScrollAreaClassName}>
      <div className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Draft Tree</div>
              <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">草稿与章节</div>
            </div>
            <div className="flex gap-2">
              {records.map((record) => (
                <Button
                  key={record.id}
                  variant={selected?.id === record.id ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => onOpenRecord(record.id)}
                >
                  {record.title}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {["Abstract", "Introduction", "Related Work", "Discussion"].map((item) => (
              <div
                key={item}
                className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.16fr)_minmax(320px,0.84fr)]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                    Draft Editor
                  </div>
                  <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">正文编辑区</div>
                </div>
                <Button variant="secondary" onClick={onSave}>
                  保存草稿
                </Button>
              </div>
              <textarea
                value={editorText}
                onChange={(event) => onEditorChange(event.target.value)}
                className="min-h-[460px] w-full rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-100"
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,0.96fr)_minmax(320px,1.04fr)]">
              <TimelinePanel milestones={selected?.milestones ?? []} onStatusChange={onUpdateMilestone} />
              <ResourceBoard resources={selected?.resources ?? []} />
            </div>
          </div>

          <div className="space-y-6">
            <TemplateWorkbench templates={selected?.templates ?? []} onInsert={onAppendContent} />
            <ActionDock
              actions={quickActions}
              templates={selected?.templates ?? []}
              onInsert={onAppendContent}
            />
            <div className="rounded-[28px] border border-indigo-200/70 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.98)_0%,rgba(238,242,255,0.96)_36%,rgba(245,243,255,0.94)_100%)] p-5 shadow-[0_20px_52px_rgba(99,102,241,0.14)]">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-500/80">Submission Rhythm</div>
              <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">投稿节奏与终检</div>
              <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                左侧专注正文与论据组织，这里负责模板插入、里程碑推进和投稿前收口，避免把收尾动作再散落到右栏。
              </div>
              <div className="mt-4 grid gap-3">
                {["压缩摘要到 200 词", "检查 related work 链路", "导出投稿版提纲"].map((label) => (
                  <Button
                    key={label}
                    variant="secondary"
                    className="justify-start"
                    onClick={() => showToast(`${label} 已生成`)}
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
);

export default MainPanel;
