import React from "react";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import type { WorkspaceQuickAction } from "@/feature/RecordWorkspace";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";
import { paperReaderRecords } from "@/pages/Research/featureData";
import {
  workbenchMainPanelShellClassName,
  workbenchScrollAreaClassName,
} from "@/pages/shared/workbench";

type PaperReaderRecord = (typeof paperReaderRecords)[number];

type Props = {
  records: PaperReaderRecord[];
  selected: PaperReaderRecord | null;
  quickActions: WorkspaceQuickAction[];
  onOpenRecord: (recordId: string) => void;
  onOpenWriter: () => void;
};

const MainPanel: React.FC<Props> = ({
  records,
  selected,
  quickActions,
  onOpenRecord,
  onOpenWriter,
}) => (
  <div className={workbenchMainPanelShellClassName}>
    <div className={workbenchScrollAreaClassName}>
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Paper Queue</div>
            <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">精读队列</div>
            <div className="mt-4 space-y-3">
              {records.map((record) => (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => onOpenRecord(record.id)}
                  className={`w-full rounded-[22px] border px-4 py-4 text-left transition ${
                    selected?.id === record.id
                      ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white/10"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-white/10 dark:bg-white/5"
                  }`}
                >
                  <div className="text-sm font-bold">{record.title}</div>
                  <div className={`mt-2 text-xs ${selected?.id === record.id ? "text-slate-200" : "text-slate-500 dark:text-slate-300"}`}>
                    {record.subtitle}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {selected ? (
              <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                      Structured Reading
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                      {selected.title}
                    </div>
                    <div className="mt-2 text-sm text-slate-500 dark:text-slate-300">{selected.summary}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => showToast("PDF 预览已打开")}>
                      PDF
                    </Button>
                    <Button variant="secondary" onClick={() => showToast("已加入比较队列")}>
                      加入比较
                    </Button>
                    <Button variant="primary" onClick={onOpenWriter}>
                      回填写作
                    </Button>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {(selected.notes ?? []).map((note: any) => (
                    <div
                      key={note.title}
                      className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/40"
                    >
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{note.title}</div>
                      <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{note.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
              <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Evidence Cards</div>
                <div className="mt-4 space-y-3">
                  {(selected?.evidenceCards ?? []).map((item: any) => (
                    <div
                      key={item.title}
                      className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-900/40"
                    >
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</div>
                      <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="secondary"
                      className="justify-start"
                      onClick={() => showToast(`${action.title} 已触发`)}
                    >
                      {action.title}
                    </Button>
                  ))}
                </div>
              </div>

              <ResourceBoard resources={selected?.resources ?? []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MainPanel;
