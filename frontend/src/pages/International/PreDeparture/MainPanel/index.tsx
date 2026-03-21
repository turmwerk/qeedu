import React from "react";
import ChecklistBoard from "@/feature/RecordWorkspace/ChecklistBoard";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import { preDepartureQuickActions, preDepartureRecords } from "@/pages/International/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";
import {
  workbenchMainPanelShellClassName,
  workbenchScrollAreaClassName,
} from "@/pages/shared/workbench";

type PreDepartureRecord = (typeof preDepartureRecords)[number];

type Props = {
  selected: PreDepartureRecord | null;
  onToggleTask: (taskId: string) => void;
};

const MainPanel: React.FC<Props> = ({ selected, onToggleTask }) => (
  <div className={workbenchMainPanelShellClassName}>
    <div className={workbenchScrollAreaClassName}>
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <ChecklistBoard tasks={selected?.tasks ?? []} onToggle={onToggleTask} />
          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Document Pack</div>
            <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">文件包校验架</div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {["护照", "签证", "Offer", "保险单", "住宿确认", "紧急联系卡"].map((item, index) => (
                <div
                  key={item}
                  className={`rounded-[22px] border px-4 py-4 ${
                    index < 3
                      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-500/10"
                      : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900/40"
                  }`}
                >
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{item}</div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-3"
                    onClick={() => showToast(`${item} 已校验`)}
                  >
                    校验
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Reminder Zone</div>
                <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">提醒区</div>
              </div>
              <Button variant="primary" onClick={() => showToast("行前提醒已发送")}>
                发送提醒
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {preDepartureQuickActions.map((item) => (
                <Button
                  key={item.id}
                  variant="secondary"
                  className="justify-start"
                  onClick={() => showToast(`${item.title} 已触发`)}
                >
                  {item.title}
                </Button>
              ))}
              <Button variant="secondary" onClick={() => showToast("准备完成状态已更新")}>
                标记准备完成
              </Button>
            </div>
          </div>
          <ResourceBoard resources={selected?.resources ?? []} />
        </div>
      </div>
    </div>
  </div>
);

export default MainPanel;
