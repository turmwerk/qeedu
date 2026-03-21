import { createMockAdapter } from "@/utils/feature/createMockAdapter";
import type { AssignmentReviewRecord } from "./AssignmentReview/types";
import { assignmentReviewRecords } from "./featureData";

export const assignmentReviewAdapter = createMockAdapter<AssignmentReviewRecord>({
  storageKey: "teaching_assignment_review_records_v2",
  idPrefix: "assignment_review",
  botName: "批改助手",
  seedRecords: assignmentReviewRecords,
  createRecord: (payload) => ({
    id: "",
    title: String(payload.title ?? "未命名批改任务"),
    subtitle: `${String(payload.course ?? "待定课程")} · ${String(payload.submissionCount ?? 0)} 份提交`,
    summary: String(payload.summary ?? "待补充任务摘要"),
    status: String(payload.status ?? "待批改"),
    tags: [String(payload.course ?? "课程任务")],
    updatedAt: Date.now(),
    content: "## 批改工作区\n- rubric\n- 反馈草稿\n- 订正记录\n",
    tasks: [
      {
        id: "task-rubric",
        title: "确认评分 rubric",
        done: false,
        detail: "补充本次作业的评分标准、扣分项和边界说明。",
        priority: "high",
      },
      {
        id: "task-feedback",
        title: "生成反馈草稿",
        done: false,
        detail: "先生成结构化反馈，再做人工抽样复核。",
        priority: "medium",
      },
    ],
    submissions: [],
    templates: [
      {
        id: "feedback-template",
        title: "结构化反馈模板",
        summary: "适合回写给学生的建设性反馈。",
        content: "## 本次作业反馈\n### 完成情况\n### 需要改进的点\n### 下一次提交前建议\n",
      },
    ],
    resources: [],
  }),
});
