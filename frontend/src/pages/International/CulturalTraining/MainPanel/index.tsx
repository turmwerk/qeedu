import React from "react";
import { useNavigate } from "react-router-dom";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import { culturalTrainingQuickActions, culturalTrainingRecords } from "@/pages/International/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";
import {
  workbenchMainPanelShellClassName,
  workbenchScrollAreaClassName,
} from "@/pages/shared/workbench";

type CulturalTrainingRecord = (typeof culturalTrainingRecords)[number];

type Props = {
  selected: CulturalTrainingRecord | null;
};

const MainPanel: React.FC<Props> = ({ selected }) => {
  const navigate = useNavigate();

  return (
    <div className={workbenchMainPanelShellClassName}>
      <div className={workbenchScrollAreaClassName}>
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Profile Card</div>
                  <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">{selected?.title}</div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate("/international/cultural-training/resources")}
                >
                  进入资源页
                </Button>
              </div>
              <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{selected?.summary}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(selected?.tags ?? []).map((tag: string) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Module Progress</div>
              <div className="mt-4 space-y-3">
                {(selected?.modules ?? []).map((module: any) => (
                  <div key={module.title}>
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{module.title}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-300">{module.progress}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 dark:bg-white/10">
                      <div className="h-3 rounded-full bg-[linear-gradient(90deg,#8b5cf6_0%,#06b6d4_100%)]" style={{ width: module.progress }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
            <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Risk Notes</div>
                  <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">风险备注与适应重点</div>
                </div>
                <div className="flex gap-2">
                  {culturalTrainingQuickActions.map((item) => (
                    <Button
                      key={item.id}
                      variant="secondary"
                      size="sm"
                      onClick={() => showToast(`${item.title} 已触发`)}
                    >
                      {item.title}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200">
                {selected?.content}
              </div>
            </div>
            <ResourceBoard resources={selected?.resources ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPanel;
