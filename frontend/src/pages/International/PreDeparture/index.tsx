import React from "react";
import { useParams } from "react-router-dom";
import ChatDialog from "@/feature/ChatDialog";
import ChecklistBoard from "@/feature/RecordWorkspace/ChecklistBoard";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { preDepartureAdapter } from "@/pages/International/featureAdapters";
import { preDeparturePageData, preDepartureQuickActions } from "@/pages/International/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";

const PreDeparture: React.FC = () => {
  const { caseId } = useParams();
  const { records, patchRecord } = useFeatureRecords(preDepartureAdapter);
  const selected = records.find((record) => record.id === caseId) ?? records[0] ?? null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[34px] bg-[linear-gradient(135deg,#0f766e_0%,#0f172a_52%,#1d4ed8_100%)] p-6 text-white shadow-[0_24px_60px_rgba(15,118,110,0.28)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-100/80">Departure Board</div>
            <div className="mt-3 text-3xl font-black md:text-4xl">{preDeparturePageData.headline}</div>
            <div className="mt-3 text-sm leading-7 text-slate-100">{preDeparturePageData.description}</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {preDeparturePageData.metrics.map((metric) => (
              <div key={metric.label} className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-100/70">{metric.label}</div>
                <div className="mt-2 text-3xl font-black">{metric.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.1fr)_360px]">
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <ChecklistBoard
              tasks={selected?.tasks ?? []}
              onToggle={(taskId) => {
                if (!selected) return;
                patchRecord(selected.id, {
                  tasks: (selected.tasks ?? []).map((task: any) =>
                    task.id === taskId ? { ...task, done: !task.done } : task,
                  ),
                });
              }}
            />
            <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
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
          <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
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
        </div>
        <div className="space-y-6">
          <ResourceBoard resources={selected?.resources ?? []} />
          {selected ? (
            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_22px_52px_rgba(15,23,42,0.24)]">
              <ChatDialog
                dialogId={`international-predeparture-${selected.id}`}
                botName="行前准备助手"
                initMessage="我已经读取当前准备清单、文件包和提醒区，可以继续输出打包清单、落地建议或风险提醒。"
                transport={preDepartureAdapter.createChatTransport(selected.title)}
              />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default PreDeparture;
