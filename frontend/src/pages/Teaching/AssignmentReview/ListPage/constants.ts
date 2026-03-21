import type { PriorityItem, QueueSummaryItem } from "./types";

export const workflowSteps = [
  {
    id: "step-rubric",
    title: "确认评分标准",
    description: "先导入 rubric、扣分项和样例答案，保证批量反馈口径一致。",
  },
  {
    id: "step-feedback",
    title: "生成反馈草稿",
    description: "结合提交内容快速输出结构化评语，再抽样检查质量。",
  },
  {
    id: "step-review",
    title: "人工复核与修订",
    description: "统一语气、修正误判，确保反馈可执行且不过度模板化。",
  },
  {
    id: "step-writeback",
    title: "回写并追踪",
    description: "将最终反馈同步给学生，并记录待订正或待复核状态。",
  },
];

export const summaryToneClassMap: Record<QueueSummaryItem["tone"], string> = {
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  orange: "border-amber-200 bg-amber-50 text-amber-700",
};

export const priorityClassMap: Record<NonNullable<PriorityItem["priority"]>, string> = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

export const statusClassMap: Record<string, string> = {
  待批改: "bg-amber-100 text-amber-700",
  批改中: "bg-sky-100 text-sky-700",
  待回写: "bg-violet-100 text-violet-700",
  已完成: "bg-emerald-100 text-emerald-700",
  复核中: "bg-sky-100 text-sky-700",
};
