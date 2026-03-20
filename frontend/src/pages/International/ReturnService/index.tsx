import React from "react";
import { useParams } from "react-router-dom";
import ChatDialog from "@/feature/ChatDialog";
import ChecklistBoard from "@/feature/RecordWorkspace/ChecklistBoard";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { returnServiceAdapter } from "@/pages/International/featureAdapters";
import { returnServicePageData, returnServiceQuickActions } from "@/pages/International/featureData";
import Button from "@/ui/Button";
import { showToast } from "@/ui/Toast";

const ReturnService: React.FC = () => {
  const { caseId } = useParams();
  const { records } = useFeatureRecords(returnServiceAdapter);
  const selected = records.find((record) => record.id === caseId) ?? records[0] ?? null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[34px] border border-slate-200 bg-[linear-gradient(135deg,#fef2f2_0%,#eff6ff_45%,#f8fafc_100%)] p-6 shadow-[0_24px_54px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(127,29,29,0.18)_0%,rgba(15,23,42,0.92)_100%)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Return Closing Desk</div>
            <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{returnServicePageData.headline}</div>
            <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{returnServicePageData.description}</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {returnServicePageData.metrics.map((metric) => (
              <div key={metric.label} className="rounded-[22px] border border-white/70 bg-white/80 px-4 py-4 dark:border-white/10 dark:bg-white/5">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{metric.label}</div>
                <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{metric.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.08fr)_360px]">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["学分认定", "提交成绩单、课程大纲与认定说明。", "处理认定"],
              ["报销办理", "补齐机票、住宿和保险票据。", "提交报销"],
              ["材料归档", "整理项目证明、照片和总结材料。", "归档材料"],
              ["经验反思", "准备分享和 FAQ 经验沉淀。", "保存反思"],
            ].map(([title, desc, cta]) => (
              <div key={title} className="rounded-[24px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
                <div className="text-sm font-bold text-slate-900 dark:text-white">{title}</div>
                <div className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{desc}</div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                  onClick={() => showToast(`${cta} 已触发`)}
                >
                  {cta}
                </Button>
              </div>
            ))}
          </div>

          <ChecklistBoard tasks={selected?.tasks ?? []} onToggle={() => {}} />
          <ResourceBoard resources={selected?.resources ?? []} />
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Closing Actions</div>
            <div className="mt-4 grid gap-3">
              {returnServiceQuickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="secondary"
                  className="justify-start"
                  onClick={() => showToast(`${action.title} 已触发`)}
                >
                  {action.title}
                </Button>
              ))}
              <Button variant="primary" onClick={() => showToast("返校案例已结案")}>
                结案
              </Button>
            </div>
          </div>
          {selected ? (
            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_22px_52px_rgba(15,23,42,0.24)]">
              <ChatDialog
                dialogId={`international-return-${selected.id}`}
                botName="返校收尾助手"
                initMessage="我已经读取当前返校案例、待办与归档资源，可以继续生成 closing 清单、经验 FAQ 或分享提纲。"
                transport={returnServiceAdapter.createChatTransport(selected.title)}
              />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default ReturnService;
