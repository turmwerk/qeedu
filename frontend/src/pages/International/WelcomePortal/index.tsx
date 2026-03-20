import React from "react";
import { useParams } from "react-router-dom";
import ChatDialog from "@/feature/ChatDialog";
import ChecklistBoard from "@/feature/RecordWorkspace/ChecklistBoard";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { welcomePortalAdapter } from "@/pages/International/featureAdapters";
import { welcomePortalPageData, welcomePortalQuickActions } from "@/pages/International/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";

const WelcomePortal: React.FC = () => {
  const { caseId } = useParams();
  const { records } = useFeatureRecords(welcomePortalAdapter);
  const selected = records.find((record) => record.id === caseId) ?? records[0] ?? null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[34px] border border-slate-200 bg-[linear-gradient(135deg,#fff7ed_0%,#ecfeff_45%,#eff6ff_100%)] p-6 shadow-[0_24px_54px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(14,116,144,0.18)_0%,rgba(15,23,42,0.92)_100%)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Incoming Support Desk</div>
            <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{welcomePortalPageData.headline}</div>
            <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{welcomePortalPageData.description}</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {welcomePortalPageData.metrics.map((metric) => (
              <div key={metric.label} className="rounded-[22px] border border-white/70 bg-white/80 px-4 py-4 dark:border-white/10 dark:bg-white/5">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{metric.label}</div>
                <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{metric.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.1fr)_360px]">
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
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

            <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
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

          <ChecklistBoard tasks={selected?.tasks ?? []} onToggle={() => {}} />
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Notice Preview</div>
            <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">Onboarding Notice</div>
            <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200">
              Dear student, welcome to NJU. Please review arrival registration, housing check-in, campus card activation and emergency contact instructions before arrival.
            </div>
            <Button variant="primary" className="mt-4" onClick={() => showToast("双语 notice 已发送")}>
              发送双语回复
            </Button>
          </div>
          {selected ? (
            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_22px_52px_rgba(15,23,42,0.24)]">
              <ChatDialog
                dialogId={`international-welcome-${selected.id}`}
                botName="来华支持助手"
                initMessage="我已经读取当前支持档案、FAQ 和待办，可以继续生成 onboarding notice、双语说明和首周支持建议。"
                transport={welcomePortalAdapter.createChatTransport(selected.title)}
              />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default WelcomePortal;
