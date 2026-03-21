import React from "react";
import ChecklistBoard from "@/feature/RecordWorkspace/ChecklistBoard";
import { welcomePortalQuickActions, welcomePortalRecords } from "@/pages/International/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";
import {
  workbenchMainPanelShellClassName,
  workbenchScrollAreaClassName,
} from "@/pages/shared/workbench";

type WelcomePortalRecord = (typeof welcomePortalRecords)[number];

type Props = {
  selected: WelcomePortalRecord | null;
};

const MainPanel: React.FC<Props> = ({ selected }) => (
  <div className={workbenchMainPanelShellClassName}>
    <div className={workbenchScrollAreaClassName}>
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Support Profile</div>
            <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">{selected?.title}</div>
            <div className="mt-3 rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200">
              {selected?.content}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {welcomePortalQuickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="secondary"
                  size="sm"
                  onClick={() => showToast(`${action.title} 已触发`)}
                >
                  {action.title}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Guide & FAQ</div>
            <div className="mt-4 space-y-3">
              {(selected?.faqTree ?? []).map((item: any) => (
                <div
                  key={item.title}
                  className={`rounded-[22px] border px-4 py-4 ${
                    item.active
                      ? "border-sky-200 bg-sky-50 dark:border-sky-400/20 dark:bg-sky-500/10"
                      : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900/40"
                  }`}
                >
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.answer}</div>
                </div>
              ))}
              <Button variant="primary" onClick={() => showToast("新的 FAQ 已添加")}>
                添加 FAQ
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.96fr)]">
          <ChecklistBoard tasks={selected?.tasks ?? []} onToggle={() => {}} />
          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Notice Preview</div>
            <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">Onboarding Notice</div>
            <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200">
              Dear student, welcome to NJU. Please review arrival registration, housing check-in, campus card activation and emergency contact instructions before arrival.
            </div>
            <Button variant="primary" className="mt-4" onClick={() => showToast("双语 notice 已发送")}>
              发送双语回复
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MainPanel;
