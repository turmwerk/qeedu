import React from "react";
import {
  createWorkspaceEvents,
  type WorkspaceBuildRecordContext,
  type WorkspaceConfig,
} from "@/feature/RecordWorkspace";
import { BookOutlined, FileTextOutlined } from "@ant-design/icons";
import { syllabusCreateFields } from "./Syllabus/data";
import { buildSyllabusMarkdown } from "./Syllabus/utils/buildMarkdown";
import { getExamCreateFields } from "./ExamDesign/data/createModalFields";
import type { DifficultyValue } from "./ExamDesign/data/types";

const asString = (value: unknown, fallback: string) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || fallback;
  }
  if (typeof value === "number") return String(value);
  return fallback;
};

// 简化的难度选择器组件，用于 RecordWorkspace 的表单
const SimpleDifficultyPicker: React.FC<{
  value?: DifficultyValue;
  onChange: (v: DifficultyValue) => void;
}> = ({ value, onChange }) => {
  const current = value || { easy: 30, medium: 50, hard: 20 };

  const handleChange = (field: keyof DifficultyValue) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    const updated = { ...current, [field]: newValue };
    // 确保总和为100
    const total = updated.easy + updated.medium + updated.hard;
    if (total !== 100) {
      const ratio = 100 / total;
      updated.easy = Math.round(updated.easy * ratio);
      updated.medium = Math.round(updated.medium * ratio);
      updated.hard = 100 - updated.easy - updated.medium;
    }
    onChange(updated);
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      <div>
        <label className="text-sm text-gray-600">简单题</label>
        <input
          type="number"
          value={current.easy}
          onChange={handleChange('easy')}
          className="w-full px-2 py-1 border rounded text-sm"
          min="0"
          max="100"
        />
      </div>
      <div>
        <label className="text-sm text-gray-600">中等题</label>
        <input
          type="number"
          value={current.medium}
          onChange={handleChange('medium')}
          className="w-full px-2 py-1 border rounded text-sm"
          min="0"
          max="100"
        />
      </div>
      <div>
        <label className="text-sm text-gray-600">困难题</label>
        <input
          type="number"
          value={current.hard}
          onChange={handleChange('hard')}
          className="w-full px-2 py-1 border rounded text-sm"
          min="0"
          max="100"
        />
      </div>
    </div>
  );
};

const syllabusWorkspaceConfig: WorkspaceConfig = {
  key: "teaching-syllabus",
  title: "课程大纲",
  headline: "课程大纲工作台",
  subtitle: "大纲生成 · 格式规范 · AI 辅助",
  description: "快速生成符合教学规范的课程大纲，支持在线编辑和 AI 润色。",
  icon: <BookOutlined />,
  routeBase: "/teaching/syllabus",
  listTitle: "大纲列表",
  listEmptyText: "暂无课程大纲，点击新建开始。",
  createModalTitle: "新建课程大纲",
  createModalDescription: "填写课程基本信息，系统将自动生成规范大纲初稿。",
  createButtonLabel: "生成初稿",
  searchPlaceholder: "搜索课程大纲",
  createFields: syllabusCreateFields,
  filters: [
    { key: "all", label: "全部", match: () => true },
    {
      key: "running",
      label: "运行中",
      match: (record) => record.status === "运行中",
    },
    {
      key: "planned",
      label: "规划中",
      match: (record) => record.status === "规划中",
    },
    {
      key: "intro",
      label: '含"导论"',
      match: (record) => record.title.includes("导论"),
    },
    {
      key: "overview",
      label: '含"概论"',
      match: (record) => record.title.includes("概论"),
    },
  ],
  storageKey: "syllabus_outlines",
  currentKey: "syllabus_current_id",
  counterKey: "syllabus_outlines_counter",
  events: createWorkspaceEvents("syllabus"),
  botName: "大纲助手",
  botIntro: "欢迎使用大纲助手，你可以询问如何改进课程大纲。",
  assistantPrompts: [
    "帮我完善课程教学目标",
    "检查学时分配是否合理",
    "生成课程简介草稿",
    "优化成绩构成方案",
  ],
  capabilities: [
    "课程信息结构化",
    "学时合理性检查",
    "教学目标润色",
    "成绩构成建议",
  ],
  deliverables: [
    "规范课程大纲",
    "课程目标说明",
    "学时分配表",
    "成绩构成方案",
  ],
  relatedLinks: [{ label: "试卷设计", to: "/teaching/exam/ListPage" }],
  buildRecord: (context: WorkspaceBuildRecordContext) => {
    const name = asString(context.payload.name, "未命名课程");
    const unit = asString(context.payload.unit, "计算机学院");
    const courseId = asString(context.payload.courseId, "00000000");
    const courseStatus = asString(context.payload.courseStatus, "运行中");
    const courseCategory = asString(context.payload.courseCategory, "学科基础课程");
    const goals = asString(context.payload.goals, "暂无育人目标");
    const credits = asString(context.payload.credits, "3");
    const totalHours = asString(context.payload.totalHours, "48");
    const examType = asString(context.payload.examType, "闭卷");
    const mdContent = buildSyllabusMarkdown(context.payload);

    return {
      id: context.id,
      title: name,
      subtitle: `${unit} · ${courseId}`,
      summary: goals,
      status: courseStatus,
      tags: [unit, courseCategory],
      metrics: [
        { label: "学分", value: credits, tone: "blue" },
        { label: "总学时", value: totalHours, tone: "blue" },
        { label: "考试类型", value: examType, tone: "default" },
        { label: "课程状态", value: courseStatus, tone: "green" },
      ],
      highlights: [
        "确保课程目标与培养目标契合。",
        "学时分配应符合课程性质。",
        "成绩构成要明确各部分占比。",
      ],
      nextSteps: [
        "完善课程教学目标描述。",
        "补充教材和参考资料信息。",
        "确认成绩构成方案。",
      ],
      content: mdContent,
      createdAt: context.createdAt,
      updatedAt: context.createdAt,
    };
  },
};

const examWorkspaceConfig: WorkspaceConfig = {
  key: "teaching-exam",
  title: "试卷设计",
  headline: "智能试卷设计工作台",
  subtitle: "AI 组卷 · 难度控制 · 智能推荐",
  description: "基于知识图谱的智能试卷生成，支持题型配比、难度控制和批量导出。",
  icon: <FileTextOutlined />,
  routeBase: "/teaching/exam",
  listTitle: "试卷列表",
  listEmptyText: "暂无试卷，点击新建开始设计。",
  createModalTitle: "新建试卷",
  createModalDescription: "设置题型数量和难度分布，AI 将自动推荐合适题目。",
  createButtonLabel: "创建试卷",
  searchPlaceholder: "搜索试卷",
  createFields: getExamCreateFields(SimpleDifficultyPicker),
  filters: [
    { key: "all", label: "全部", match: () => true },
    {
      key: "draft",
      label: "草稿",
      match: (record) => record.status === "草稿",
    },
    {
      key: "finished",
      label: "已完成",
      match: (record) => record.status === "已完成",
    },
    {
      key: "published",
      label: "已发布",
      match: (record) => record.status === "已发布",
    },
  ],
  storageKey: "exam_design_exams_v1",
  currentKey: "exam_design_current_id",
  counterKey: "exam_design_exams_counter",
  events: createWorkspaceEvents("exam"),
  botName: "组卷助手",
  botIntro: "我是AI组卷助手，可以帮您智能推荐题目，优化试卷结构。",
  assistantPrompts: [
    "推荐一些选择题",
    "检查试卷难度分布",
    "优化题目搭配",
    "生成标准答案",
  ],
  capabilities: [
    "智能题目推荐",
    "难度自动控制",
    "知识点覆盖分析",
    "试卷质量评估",
  ],
  deliverables: [
    "完整试卷",
    "参考答案",
    "评分标准",
    "难度分析报告",
  ],
  relatedLinks: [{ label: "课程大纲", to: "/teaching/syllabus/ListPage" }],
  buildRecord: (context: WorkspaceBuildRecordContext) => {
    const name = asString(context.payload.name, "未命名试卷");
    const difficulty = context.payload.difficulty as DifficultyValue || { easy: 30, medium: 50, hard: 20 };
    const chooseCount = context.payload.choose_count as number || 10;
    const shortCount = context.payload.short_count as number || 4;
    const fillCount = context.payload.fill_count as number || 0;
    const programCount = context.payload.program_count as number || 0;
    const essayCount = context.payload.essay_count as number || 0;
    const content = asString(context.payload.content, "");

    const totalQuestions = chooseCount + shortCount + fillCount + programCount + essayCount;

    // 生成初始的试卷模板 Markdown
    const examTemplate = `# ${name}

## 试卷信息
- 题目总数：${totalQuestions}
- 难度分布：简单 ${difficulty.easy}%，中等 ${difficulty.medium}%，困难 ${difficulty.hard}%
- 考察内容：${content}

## 题型分布
${chooseCount > 0 ? `### 选择题（${chooseCount} 题）\n题目将在此处生成...\n` : ""}
${fillCount > 0 ? `### 填空题（${fillCount} 题）\n题目将在此处生成...\n` : ""}
${shortCount > 0 ? `### 简答题（${shortCount} 题）\n题目将在此处生成...\n` : ""}
${programCount > 0 ? `### 编程题（${programCount} 题）\n题目将在此处生成...\n` : ""}
${essayCount > 0 ? `### 论述题（${essayCount} 题）\n题目将在此处生成...\n` : ""}

## 备注
- 请在右侧AI助手中请求推荐合适的题目
- 可使用模板工作台快速插入标准题型格式
`;

    return {
      id: context.id,
      title: name,
      subtitle: `${totalQuestions} 题 · ${content || "综合测试"}`,
      summary: `题型：选择${chooseCount}题，简答${shortCount}题，填空${fillCount}题，编程${programCount}题，论述${essayCount}题`,
      status: "草稿",
      tags: ["试卷设计"],
      metrics: [
        { label: "题目总数", value: String(totalQuestions), tone: "blue" },
        { label: "选择题", value: String(chooseCount), tone: "default" },
        { label: "简答题", value: String(shortCount), tone: "default" },
        { label: "状态", value: "草稿", tone: "orange" },
      ],
      highlights: [
        "确保难度分布符合教学目标。",
        "检查知识点覆盖是否全面。",
        "验证题目表述清晰准确。",
      ],
      nextSteps: [
        "使用AI助手推荐合适题目。",
        "调整题目顺序和分值分配。",
        "生成标准答案和评分标准。",
      ],
      templates: [
        {
          id: "template-choice",
          title: "选择题模板",
          summary: "标准四选一选择题格式",
          content: `## X. [题干]\n\nA. [选项A]\nB. [选项B]\nC. [选项C]\nD. [选项D]\n\n**答案：** [正确选项]\n**解析：** [答题思路]\n\n`,
        },
        {
          id: "template-short",
          title: "简答题模板",
          summary: "简答题标准格式",
          content: `## X. [题干]（X分）\n\n**参考答案：**\n1. [要点1]\n2. [要点2]\n3. [要点3]\n\n**评分标准：**\n- [评分要点1]（X分）\n- [评分要点2]（X分）\n\n`,
        },
        {
          id: "template-program",
          title: "编程题模板",
          summary: "编程题标准格式",
          content: `## X. [题目描述]（X分）\n\n**输入格式：**\n[输入说明]\n\n**输出格式：**\n[输出说明]\n\n**样例输入：**\n\`\`\`\n[样例输入]\n\`\`\`\n\n**样例输出：**\n\`\`\`\n[样例输出]\n\`\`\`\n\n**参考解答：**\n\`\`\`python\n# [代码实现]\n\`\`\`\n\n`,
        },
      ],
      content: examTemplate,
      createdAt: context.createdAt,
      updatedAt: context.createdAt,
    };
  },
};

export const teachingWorkspaceConfigs: WorkspaceConfig[] = [
  syllabusWorkspaceConfig,
  examWorkspaceConfig,
];
