import type { FormField } from "@/ui/Form";

const now = Date.now();
const ago = (hours: number) => now - hours * 60 * 60 * 1000;

export const assignmentReviewPageData = {
  headline: "作业批改与反馈工作室",
  subtitle: "任务队列、评分 rubric、反馈草稿、订正追踪",
  description: "围绕作业任务、学生提交和反馈回写形成连续批改闭环。",
  metrics: [
    { label: "待批改任务", value: "12", detail: "含 3 个高优先级任务" },
    { label: "待复核提交", value: "54", detail: "多集中在程序设计课程" },
    { label: "平均回写时长", value: "18 min", detail: "本周较上周缩短 4 分钟" },
  ],
  createFields: [
    { name: "title", label: "任务名称", placeholder: "例如：程序设计基础 - 第 4 次作业" },
    { name: "course", label: "课程名称", placeholder: "例如：程序设计基础" },
    { name: "submissionCount", label: "提交数量", type: "number", defaultValue: 40 },
    {
      name: "status",
      label: "任务状态",
      type: "select",
      options: [
        { label: "待批改", value: "待批改" },
        { label: "批改中", value: "批改中" },
        { label: "待回写", value: "待回写" },
      ],
      defaultValue: "待批改",
    },
    { name: "summary", label: "任务摘要", type: "textarea", rows: 4, placeholder: "描述本次批改重点与 rubric 提示。" },
  ] satisfies FormField[],
};

export const assignmentReviewRecords = [
  {
    id: "assignment-review-ps4",
    title: "程序设计基础 - 第 4 次作业",
    subtitle: "89 份提交 · 截止今晚 23:59",
    summary: "重点关注代码规范、复杂度说明和测试覆盖率。",
    status: "待批改",
    tags: ["编程作业", "自动评分+人工复核"],
    updatedAt: ago(2),
    content: "## 批改要点\n- 功能正确性\n- 代码规范\n- 测试覆盖率\n- 复杂度说明",
    tasks: [
      { id: "task-1", title: "导入 rubric", done: true, detail: "沿用课程统一评分表。", priority: "high" as const },
      { id: "task-2", title: "生成反馈草稿", done: false, detail: "批量生成后抽样复核。", priority: "high" as const },
      { id: "task-3", title: "回写学生端", done: false, detail: "回写后同步订正状态。", priority: "medium" as const },
    ],
    submissions: [
      { id: "submission-1", studentName: "王小雨", score: "88", status: "待回写" },
      { id: "submission-2", studentName: "李子涵", score: "79", status: "复核中" },
      { id: "submission-3", studentName: "陈晨", score: "93", status: "已完成" },
    ],
    templates: [
      {
        id: "feedback-template",
        title: "结构化反馈模板",
        summary: "适合回写给学生的建设性反馈。",
        content: "## 本次作业反馈\n### 完成情况\n### 需要改进的点\n### 下一次提交前建议\n",
      },
    ],
  },
  {
    id: "assignment-review-db2",
    title: "数据库系统 - 实验报告 2",
    subtitle: "42 份提交 · 下周一前完成",
    summary: "已有自动评语，需要统一语气并补充个性化建议。",
    status: "批改中",
    tags: ["实验报告", "LLM 反馈"],
    updatedAt: ago(16),
    content: "## 当前进度\n- 自动评语已生成\n- 待人工抽样复核\n- 待导出结果",
    tasks: [
      { id: "task-1", title: "抽样复核", done: true, detail: "已完成 10 份。", priority: "medium" as const },
      { id: "task-2", title: "统一语气", done: false, detail: "避免表达过于生硬。", priority: "medium" as const },
    ],
    submissions: [
      { id: "submission-4", studentName: "赵宇", score: "84", status: "复核中" },
      { id: "submission-5", studentName: "林嘉", score: "90", status: "待回写" },
    ],
    templates: [],
  },
];

export const assignmentReviewQuickActions = [
  {
    id: "assignment-review-action-1",
    title: "生成建设性反馈",
    description: "突出优点、指出问题并给下次提交建议。",
    prompt: "请基于当前 rubric 生成建设性反馈，包含肯定、问题和可执行建议。",
    action: "copy_prompt" as const,
  },
  {
    id: "assignment-review-action-2",
    title: "导出评分说明",
    description: "整理成本次作业批改标准摘要。",
    prompt: "请把当前 rubric 压缩成一段老师可发给学生的评分说明。",
    action: "append_prompt" as const,
  },
];
