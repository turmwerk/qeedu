import React from "react";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import TimelinePanel from "@/feature/RecordWorkspace/TimelinePanel";
import { exchangeHubRecords, exchangeHubQuickActions } from "@/pages/International/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";
import {
  workbenchMainPanelShellClassName,
  workbenchScrollAreaClassName,
} from "@/pages/shared/workbench";

type ExchangeHubRecord = (typeof exchangeHubRecords)[number];

type Props = {
  records: ExchangeHubRecord[];
  selected: ExchangeHubRecord | null;
  onOpenRecord: (recordId: string) => void;
};

const MainPanel: React.FC<Props> = ({ records, selected, onOpenRecord }) => (
  <div className={workbenchMainPanelShellClassName}>
    <div className={workbenchScrollAreaClassName}>
      <div className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Directory Grid</div>
              <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">项目目录</div>
            </div>
            <div className="flex gap-2">
              {["交换", "暑校", "联合培养"].map((item) => (
                <Button
                  key={item}
                  variant="secondary"
                  size="sm"
                  onClick={() => showToast(`已筛选 ${item}`)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {records.map((record) => (
              <button
                key={record.id}
                type="button"
                onClick={() => onOpenRecord(record.id)}
                className={`rounded-[24px] border px-4 py-4 text-left transition ${
                  selected?.id === record.id
                    ? "border-blue-300 bg-blue-50 dark:border-blue-300/30 dark:bg-blue-500/10"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-white/10 dark:bg-white/5"
                }`}
              >
                <div className="text-sm font-bold text-slate-900 dark:text-white">{record.title}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">{record.subtitle}</div>
                <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{record.summary}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(record.tags ?? []).map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {selected ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.88fr)]">
            <div className="space-y-6">
              <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Project Preview</div>
                    <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{selected.title}</div>
                    <div className="mt-2 text-sm text-slate-500 dark:text-slate-300">{selected.summary}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {exchangeHubQuickActions.map((action) => (
                      <Button
                        key={action.id}
                        variant="secondary"
                        size="sm"
                        onClick={() => showToast(`${action.title} 已触发`)}
                      >
                        {action.title}
                      </Button>
                    ))}
                    <Button variant="primary" onClick={() => showToast("已加入比较托盘")}>
                      加入比较
                    </Button>
                  </div>
                </div>
                <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200">
                  {selected.content}
                </div>
              </div>
              <ResourceBoard resources={selected.resources ?? []} />
            </div>
            <TimelinePanel milestones={selected.timeline ?? []} onStatusChange={() => {}} />
          </div>
        ) : null}
      </div>
    </div>
  </div>
);

export default MainPanel;
