import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatDialog from "@/feature/ChatDialog";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { abroadLifeAdapter } from "@/pages/International/featureAdapters";
import { abroadLifePageData, abroadLifeQuickActions } from "@/pages/International/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";

const AbroadLife: React.FC = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const { records } = useFeatureRecords(abroadLifeAdapter);
  const selected = records.find((record) => record.id === ticketId) ?? records[0] ?? null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[34px] border border-slate-200 bg-[linear-gradient(135deg,#eff6ff_0%,#ecfeff_52%,#f8fafc_100%)] p-6 shadow-[0_24px_54px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(14,116,144,0.18)_0%,rgba(15,23,42,0.92)_100%)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Overseas Support Center</div>
            <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{abroadLifePageData.headline}</div>
            <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{abroadLifePageData.description}</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {abroadLifePageData.metrics.map((metric) => (
              <div key={metric.label} className="rounded-[22px] border border-white/70 bg-white/80 px-4 py-4 dark:border-white/10 dark:bg-white/5">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{metric.label}</div>
                <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{metric.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[300px_minmax(0,1fr)_360px]">
        <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Support Tickets</div>
          <div className="mt-4 space-y-3">
            {records.map((record) => (
              <button
                key={record.id}
                type="button"
                onClick={() => navigate(`/international/abroad-life/tickets/${record.id}`)}
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
          <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
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
            <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
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

        <div className="space-y-6">
          {selected ? (
            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_22px_52px_rgba(15,23,42,0.24)]">
              <ChatDialog
                dialogId={`international-abroad-${selected.id}`}
                botName="在外支持助手"
                initMessage="我已经读取当前支持工单、应急卡和生活指南，可以继续给出课程调整、住宿续约、证件遗失和夜间应急建议。"
                transport={abroadLifeAdapter.createChatTransport(selected.title)}
              />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default AbroadLife;
