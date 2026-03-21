import React, { useMemo } from "react";
import type { AssignmentReviewRecord } from "../../../types";

type Props = {
  record: AssignmentReviewRecord;
};

const queueToneClassMap: Record<"blue" | "green" | "orange" | "violet", string> = {
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  orange: "border-amber-200 bg-amber-50 text-amber-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
};

const AssignmentBriefSection: React.FC<Props> = ({ record }) => {
  const submissionStats = useMemo(() => {
    const submissions = record.submissions ?? [];
    const reviewing = submissions.filter((item) => item.status === "复核中").length;
    const waitingWriteback = submissions.filter((item) => item.status === "待回写").length;
    const completed = submissions.filter((item) => item.status === "已完成").length;

    return [
      {
        label: "复核中提交",
        value: String(reviewing),
        hint: reviewing ? "优先统一语气和扣分口径" : "当前没有需要复核的提交",
        tone: "blue" as const,
      },
      {
        label: "待回写提交",
        value: String(waitingWriteback),
        hint: waitingWriteback ? "确认反馈后尽快回写学生端" : "当前没有待回写提交",
        tone: "violet" as const,
      },
      {
        label: "已完成回写",
        value: String(completed),
        hint: completed ? "已完成反馈闭环的提交数量" : "还没有完成回写的提交",
        tone: "green" as const,
      },
      {
        label: "待开始批改",
        value: String(Math.max(submissions.length - reviewing - waitingWriteback - completed, 0)),
        hint: submissions.length ? "可从下方提交队列直接进入处理" : "等待导入学生提交",
        tone: "orange" as const,
      },
    ];
  }, [record.submissions]);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.15fr)_0.95fr]">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
            Assignment Brief
          </div>
          <div className="mt-2 text-lg font-black text-slate-900 dark:text-white">
            {record.summary || "等待补充本次作业的批改重点与处理要求。"}
          </div>
          <div className="mt-3 rounded-[22px] bg-slate-50 p-4 text-sm leading-7 text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
            {record.subtitle ||
              "当前页面聚焦单个批改任务，左侧处理内容，右侧通过对话协同生成反馈与复核建议。"}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {submissionStats.map((item) => (
            <div
              key={item.label}
              className={`rounded-[22px] border px-4 py-4 ${queueToneClassMap[item.tone]}`}
            >
              <div className="text-xs font-bold tracking-[0.16em] opacity-80">
                {item.label}
              </div>
              <div className="mt-2 text-2xl font-black">{item.value}</div>
              <div className="mt-1 text-sm leading-6 opacity-80">{item.hint}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AssignmentBriefSection;
