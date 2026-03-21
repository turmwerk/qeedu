import React from "react";
import type { AssignmentReviewRecord, AssignmentReviewSubmission } from "../../types";
import Button from "@/ui/Button";
import PageHeader from "@/ui/PageHeader";

type Props = {
  record: AssignmentReviewRecord;
  selectedSubmission?: AssignmentReviewSubmission;
  onBack: () => void;
  onUploadFolder: () => void;
  onGenerateFeedback: () => void;
  onWriteback: () => void;
  onExportRubric: () => void;
};

const statusClassMap: Record<string, string> = {
  待批改: "bg-amber-100 text-amber-700",
  批改中: "bg-sky-100 text-sky-700",
  待回写: "bg-violet-100 text-violet-700",
  已完成: "bg-emerald-100 text-emerald-700",
  复核中: "bg-sky-100 text-sky-700",
};

const formatUpdatedAt = (value?: number) => {
  if (!value) return "刚刚更新";
  const diff = Date.now() - value;
  const minutes = Math.max(1, Math.floor(diff / (1000 * 60)));
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  return `${Math.floor(hours / 24)} 天前`;
};

const AssignmentReviewDetailHeader: React.FC<Props> = ({
  record,
  selectedSubmission,
  onBack,
  onUploadFolder,
  onGenerateFeedback,
  onWriteback,
  onExportRubric,
}) => {
  const totalSubmissions = record.submissions?.length ?? 0;
  const completedSubmissions =
    record.submissions?.filter((item) => item.status === "已完成").length ?? 0;
  const pendingSubmissions = Math.max(totalSubmissions - completedSubmissions, 0);

  return (
    <section className="rounded-[32px] border border-slate-200 bg-[linear-gradient(135deg,#f8fbff_0%,#eef4ff_50%,#fff7ed_100%)] p-6 shadow-[0_22px_48px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(30,41,59,0.9)_0%,rgba(30,64,175,0.24)_100%)]">
      <PageHeader
        title={
          <span className="text-3xl font-black text-slate-900 dark:text-white">
            {record.title}
          </span>
        }
        subtitle={
          <span className="text-sm text-slate-600 dark:text-slate-300">
            {record.subtitle || record.summary || "进入作业批改工作区"}
          </span>
        }
        className="mb-0"
      >
        <Button variant="secondary" size="sm" onClick={onBack}>
          返回任务概览
        </Button>
        <Button variant="secondary" size="sm" onClick={onUploadFolder}>
          上传作业文件夹
        </Button>
      </PageHeader>

      <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              statusClassMap[record.status ?? ""] ?? "bg-slate-100 text-slate-700"
            }`}
          >
            {record.status ?? "未标记"}
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
            {totalSubmissions} 份提交
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
            待处理 {pendingSubmissions} 份
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
            已回写 {completedSubmissions} 份
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">
            最近更新 {formatUpdatedAt(record.updatedAt)}
          </span>
          {selectedSubmission ? (
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
              当前提交：{selectedSubmission.studentName}
            </span>
          ) : null}
          {(record.tags ?? []).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={onExportRubric}>
            导出 Rubric
          </Button>
          <Button variant="secondary" size="sm" onClick={onGenerateFeedback}>
            生成反馈
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onWriteback}
            disabled={!selectedSubmission}
          >
            回写学生端
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AssignmentReviewDetailHeader;
