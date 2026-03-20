import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatDialog from "@/feature/ChatDialog";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import TimelinePanel from "@/feature/RecordWorkspace/TimelinePanel";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { exchangeHubAdapter } from "@/pages/International/featureAdapters";
import { exchangeHubPageData, exchangeHubQuickActions } from "@/pages/International/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";

const ExchangeHub: React.FC = () => {
  const navigate = useNavigate();
  const { programId } = useParams();
  const { records } = useFeatureRecords(exchangeHubAdapter);
  const selected = records.find((record) => record.id === programId) ?? records[0] ?? null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[34px] border border-slate-200 bg-[linear-gradient(135deg,#eff6ff_0%,#f0fdf4_45%,#fff7ed_100%)] p-6 shadow-[0_24px_54px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(30,64,175,0.2)_0%,rgba(15,23,42,0.92)_100%)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
              Global Program Atlas
            </div>
            <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
              {exchangeHubPageData.headline}
            </div>
            <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {exchangeHubPageData.description}
            </div>
          </div>
          <div className="flex gap-2">
            {exchangeHubPageData.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[22px] border border-white/70 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5"
              >
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{metric.label}</div>
                <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{metric.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.16fr)_360px]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
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
                  onClick={() => navigate(`/international/exchange-hub/programs/${record.id}`)}
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
            <div className="grid gap-6 xl:grid-cols-[1fr_0.92fr]">
              <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
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
              <TimelinePanel milestones={selected.timeline ?? []} onStatusChange={() => {}} />
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <ResourceBoard resources={selected?.resources ?? []} />
          {selected ? (
            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_22px_52px_rgba(15,23,42,0.24)]">
              <ChatDialog
                dialogId={`international-exchange-${selected.id}`}
                botName="项目助手"
                initMessage="我已经读取当前项目摘要、时间线和上下游联动模块，可以继续帮你比较门槛、生成纪要或衔接流程。"
                transport={exchangeHubAdapter.createChatTransport(selected.title)}
              />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default ExchangeHub;
