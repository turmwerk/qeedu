import { createMockAdapter } from "@/utils/feature/createMockAdapter";
import { assignmentReviewRecords } from "./featureData";

export const assignmentReviewAdapter = createMockAdapter<any>({
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
    tasks: [],
    submissions: [],
    templates: [],
  }),
});
