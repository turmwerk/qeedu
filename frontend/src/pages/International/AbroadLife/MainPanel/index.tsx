import React from "react";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import { abroadLifeQuickActions, abroadLifeRecords } from "@/pages/International/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";
import {
  workbenchMainPanelShellClassName,
  workbenchScrollAreaClassName,
} from "@/pages/shared/workbench";

type AbroadLifeRecord = (typeof abroadLifeRecords)[number];

type Props = {
  records: AbroadLifeRecord[];
  selected: AbroadLifeRecord | null;
  onOpenRecord: (recordId: string) => void;
};

const MainPanel: React.FC<Props> = ({ records, selected, onOpenRecord }) => (
  <div className={workbenchMainPanelShellClassName}>
    <div className={workbenchScrollAreaClassName}>
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Support Tickets</div>
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
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Current Ticket</div>
                  <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">{selected?.title}</div>
                </div>
                <div className="flex gap-2">
                  {abroadLifeQuickActions.map((item) => (
                    <Button
                      key={item.id}
                      variant="secondary"
                      size="sm"
                      onClick={() => showToast(`${item.title} 已触发`)}
                    >
                      {item.title}
                    </Button>
                  ))}
                  <Button variant="primary" onClick={() => showToast("已升级为紧急事件")}>
                    升级紧急事件
                  </Button>
                </div>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200">
                {selected?.content}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Emergency Cards</div>
                <div className="mt-4 space-y-3">
                  {(selected?.emergencyCards ?? []).map((item: any) => (
                    <div key={item.title} className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-900/40">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</div>
                      <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.summary}</div>
                    </div>
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
