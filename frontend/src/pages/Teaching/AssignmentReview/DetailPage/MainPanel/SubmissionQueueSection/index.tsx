import React from "react";
import PageHeader from "@/ui/PageHeader";
import type { AssignmentReviewRecord, AssignmentReviewSubmission } from "../../../types";

type Props = {
  record: AssignmentReviewRecord;
  selectedSubmission?: AssignmentReviewSubmission;
  onSelectSubmission: (submissionId: string) => void;
};

const SubmissionQueueSection: React.FC<Props> = ({
  record,
  selectedSubmission,
  onSelectSubmission,
}) => {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
      <PageHeader
        title={<span className="text-xl font-black text-slate-900 dark:text-white">学生提交队列</span>}
        subtitle="选择一份提交后，批改内容区和右侧对话都会切到当前学生上下文。"
      />

      {(record.submissions ?? []).length ? (
        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {record.submissions?.map((item) => {
            const active = item.id === selectedSubmission?.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSubmission(item.id)}
                className={`rounded-[22px] border px-4 py-4 text-left transition ${
                  active
                    ? "border-cyan-300 bg-cyan-50 shadow-[0_14px_32px_rgba(14,165,233,0.12)]"
                    : "border-slate-200 bg-white hover:border-cyan-200 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      {item.studentName}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                      学号与提交文件待接入
                    </div>
                  </div>
                  <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {item.score} 分
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {item.status}
                  </span>
                  {active ? (
                    <span className="rounded-full bg-cyan-600 px-2.5 py-1 text-xs font-semibold text-white">
                      当前批改中
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-300">
          当前还没有学生提交，可以先通过顶部按钮上传作业文件夹。
        </div>
      )}
    </section>
  );
};

export default SubmissionQueueSection;
