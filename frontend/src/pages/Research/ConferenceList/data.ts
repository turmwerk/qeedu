import type { WorkspaceMetric } from "@/feature/RecordWorkspace";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const toStartOfDay = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const getDaysUntil = (value: string) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = toStartOfDay(value);
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / DAY_IN_MS));
};

const formatMonthDay = (value: string) => {
  const date = toStartOfDay(value);
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
};

export type ConferenceTodo = {
  id: string;
  title: string;
  detail: string;
  priority: "高优先" | "中优先" | "低优先";
  done: boolean;
};

export type ConferenceEntry = {
  id: string;
  name: string;
  fullName: string;
  field: string;
  ccf: string;
  tags: string[];
  abstractDeadline?: string;
  paperDeadline: string;
  nextDeadlineLabel: string;
  nextDeadlineDate: string;
  nextDeadlineDisplay: string;
  nextDeadlineDays: number;
  reminderStatus: string;
  reminderActive: boolean;
  summary: string;
  note: string;
  reviewTask: string;
  reviewCountdownDays: number;
  progressCompleted: number;
  progressTotal: number;
  todos: ConferenceTodo[];
};

const baseConferenceEntries: Array<Omit<ConferenceEntry, "nextDeadlineDisplay" | "nextDeadlineDays">> = [
  {
    id: "chi-2027",
    name: "CHI 2027",
    fullName: "ACM Conference on Human Factors in Computing Systems",
    field: "HCI",
    ccf: "CCF A",
    tags: ["HCI", "交互设计", "AI 协作"],
    abstractDeadline: "2026-03-28",
    paperDeadline: "2026-04-04",
    nextDeadlineLabel: "摘要",
    nextDeadlineDate: "2026-03-28",
    reminderStatus: "已加入提醒",
    reminderActive: true,
    summary: "优先完成摘要、图表整理与 related work 主线，确保 contribution framing 先收敛。",
    note: "今年更适合投 system + study 结合的方向，标题和摘要要尽早统一叙事。",
    reviewTask: "综述初稿",
    reviewCountdownDays: 5,
    progressCompleted: 4,
    progressTotal: 7,
    todos: [
      {
        id: "chi-1",
        title: "确认投稿主题与标题方向",
        detail: "收敛 contribution framing，明确更偏 system、study 还是 design implication。",
        priority: "高优先",
        done: false,
      },
      {
        id: "chi-2",
        title: "完成 abstract 初稿",
        detail: "摘要里要交代问题、方法、主要发现与贡献，尽量与 title 一致。",
        priority: "高优先",
        done: false,
      },
      {
        id: "chi-3",
        title: "检查图表与系统架构图",
        detail: "确认图注、可读性与论文 narrative 一致，优先完成核心 overview figure。",
        priority: "中优先",
        done: false,
      },
      {
        id: "chi-4",
        title: "补齐 recent related work",
        detail: "重点检查近两年与 intervention timing、creative support、anchoring 有关的工作。",
        priority: "中优先",
        done: false,
      },
    ],
  },
  {
    id: "acl-2027",
    name: "ACL 2027",
    fullName: "Annual Meeting of the Association for Computational Linguistics",
    field: "AI / NLP",
    ccf: "CCF A",
    tags: ["NLP", "LLM", "Evaluation"],
    paperDeadline: "2026-04-09",
    nextDeadlineLabel: "全文",
    nextDeadlineDate: "2026-04-09",
    reminderStatus: "待加入提醒",
    reminderActive: false,
    summary: "方法和实验已经接近稳定，更需要补实验对比、消融和写作表达。",
    note: "如果主投 ACL，建议把 reviewer 最容易质疑的评测设计单独补一页说明。",
    reviewTask: "related work 补齐",
    reviewCountdownDays: 11,
    progressCompleted: 3,
    progressTotal: 6,
    todos: [
      {
        id: "acl-1",
        title: "补齐主实验与 ablation 表格",
        detail: "确保基线完整，注明显著性差异与主要观察。",
        priority: "高优先",
        done: false,
      },
      {
        id: "acl-2",
        title: "统一术语与任务定义",
        detail: "摘要、引言与实验部分的任务命名保持一致，避免 reviewer 误解。",
        priority: "中优先",
        done: false,
      },
      {
        id: "acl-3",
        title: "压缩引言并补贡献列表",
        detail: "把 narrative 调整为问题动机、方法概览、关键结果、贡献列表四段式。",
        priority: "中优先",
        done: true,
      },
    ],
  },
  {
    id: "uist-2027",
    name: "UIST 2027",
    fullName: "ACM Symposium on User Interface Software and Technology",
    field: "HCI / Systems",
    ccf: "CCF A",
    tags: ["HCI", "Systems", "Prototype"],
    paperDeadline: "2026-05-01",
    nextDeadlineLabel: "全文",
    nextDeadlineDate: "2026-05-01",
    reminderStatus: "已加入提醒",
    reminderActive: true,
    summary: "当前时间还够，可以先稳定原型，再提炼一条更强的 interaction story。",
    note: "UIST 更看重系统与交互原型的完整度，视频和 demo narrative 要提前想。",
    reviewTask: "系统章节二稿",
    reviewCountdownDays: 18,
    progressCompleted: 2,
    progressTotal: 5,
    todos: [
      {
        id: "uist-1",
        title: "收敛 demo 场景与核心任务流",
        detail: "确保视频展示的关键步骤能够覆盖主贡献，不要让 narrative 分散。",
        priority: "高优先",
        done: false,
      },
      {
        id: "uist-2",
        title: "补用户研究方案",
        detail: "提前明确 participants、tasks、measures 与预期分析方式。",
        priority: "中优先",
        done: false,
      },
      {
        id: "uist-3",
        title: "梳理系统实现与局限",
        detail: "把 architecture、latency 与 failure cases 形成可复述的说明。",
        priority: "低优先",
        done: true,
      },
    ],
  },
];

export const conferenceEntries: ConferenceEntry[] = baseConferenceEntries
  .map((conference) => {
    const nextDeadlineDays = getDaysUntil(conference.nextDeadlineDate);
    return {
      ...conference,
      nextDeadlineDays,
      nextDeadlineDisplay: formatMonthDay(conference.nextDeadlineDate),
    };
  })
  .sort((left, right) => left.nextDeadlineDays - right.nextDeadlineDays);

export const conferenceCountdownMetrics: WorkspaceMetric[] = [
  {
    label: "近期会议",
    value: `${conferenceEntries[0]?.name} · ${conferenceEntries[0]?.nextDeadlineDays ?? 0} 天`,
    description: `${conferenceEntries[0]?.nextDeadlineLabel}截止 ${conferenceEntries[0]?.nextDeadlineDisplay}，点击查看会议列表与待办。`,
    badge: "会议",
    tone: "blue",
    to: `/research/conference-list?conference=${conferenceEntries[0]?.id ?? "chi-2027"}`,
  },
  {
    label: "第二优先投稿",
    value: `${conferenceEntries[1]?.name} · ${conferenceEntries[1]?.nextDeadlineDays ?? 0} 天`,
    description: `${conferenceEntries[1]?.nextDeadlineLabel}截止 ${conferenceEntries[1]?.nextDeadlineDisplay}，适合并行推进实验和写作。`,
    badge: "会议",
    tone: "green",
    to: `/research/conference-list?conference=${conferenceEntries[1]?.id ?? "acl-2027"}`,
  },
  {
    label: "综述初稿",
    value: `${conferenceEntries[0]?.reviewCountdownDays ?? 0} 天`,
    description: "完成摘要、主题簇和 related work 主线，避免投稿前再回头补综述骨架。",
    badge: "综述任务",
    tone: "orange",
  },
  {
    label: "系统章节二稿",
    value: `${conferenceEntries[2]?.reviewCountdownDays ?? 0} 天`,
    description: "把方法、原型和评测 narrative 统一起来，后续更容易转成投稿版本。",
    badge: "写作任务",
    tone: "default",
  },
];

export const findConferenceById = (conferenceId: string | null | undefined) =>
  conferenceEntries.find((conference) => conference.id === conferenceId);
