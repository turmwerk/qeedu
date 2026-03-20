import React from "react";
import { useParams } from "react-router-dom";
import ChatDialog from "@/feature/ChatDialog";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { culturalTrainingAdapter } from "@/pages/International/featureAdapters";
import { culturalTrainingPageData, culturalTrainingQuickActions } from "@/pages/International/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";

const CulturalTraining: React.FC = () => {
  const { profileId } = useParams();
  const { records } = useFeatureRecords(culturalTrainingAdapter);
  const selected = records.find((record) => record.id === profileId) ?? records[0] ?? null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[34px] bg-[linear-gradient(135deg,#f5f3ff_0%,#ede9fe_45%,#fefce8_100%)] p-6 shadow-[0_24px_54px_rgba(15,23,42,0.08)] dark:bg-[linear-gradient(135deg,rgba(76,29,149,0.24)_0%,rgba(15,23,42,0.92)_100%)]">
        <div className="max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Cultural Training Map</div>
          <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{culturalTrainingPageData.headline}</div>
          <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{culturalTrainingPageData.description}</div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.08fr)_360px]">
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Profile Card</div>
              <div className="mt-2 text-xl font-black text-slate-900 dark:text-white">{selected?.title}</div>
              <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{selected?.summary}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(selected?.tags ?? []).map((tag: string) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
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

          <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
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
        </div>

        <div className="space-y-6">
          <ResourceBoard resources={selected?.resources ?? []} />
          {selected ? (
            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_22px_52px_rgba(15,23,42,0.24)]">
              <ChatDialog
                dialogId={`international-culture-${selected.id}`}
                botName="跨文化适应助手"
                initMessage="我已经读取当前画像、模块进度与风险备注，可以继续生成适应建议、情境解释和安全提醒。"
                transport={culturalTrainingAdapter.createChatTransport(selected.title)}
              />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default CulturalTraining;
