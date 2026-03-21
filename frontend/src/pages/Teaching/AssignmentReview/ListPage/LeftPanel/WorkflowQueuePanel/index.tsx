import React from "react";
import PageHeader from "@/ui/PageHeader";
import { summaryToneClassMap, workflowSteps } from "../../constants";
import type { QueueSummaryItem } from "../../types";

type WorkflowQueuePanelProps = {
  queueSummary: QueueSummaryItem[];
};

const WorkflowQueuePanel: React.FC<WorkflowQueuePanelProps> = ({ queueSummary }) => {
  return (
    <section className="space-y-5">
      <PageHeader
        title={<span className="text-xl font-black text-slate-900 dark:text-white">批改流程与队列</span>}
        subtitle="首页只保留全局统计、流程和任务入口，进入右侧任务后再处理具体批改。"
      />

      <div className="grid gap-3 md:grid-cols-3">
        {queueSummary.map((item) => (
          <div
            key={item.label}
            className={`rounded-[22px] border px-4 py-4 ${summaryToneClassMap[item.tone]}`}
          >
            <div className="text-xs font-bold tracking-[0.16em] opacity-80">{item.label}</div>
            <div className="mt-2 text-2xl font-black">{item.value}</div>
            <div className="mt-1 text-sm leading-6 opacity-80">{item.hint}</div>
          </div>
        ))}
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-slate-900/40">
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
          Review Workflow
        </div>
        <div className="mt-4 grid gap-3">
          {workflowSteps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-start gap-3 rounded-[20px] border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-white dark:bg-slate-100 dark:text-slate-900">
                {index + 1}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </div>
                <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowQueuePanel;
