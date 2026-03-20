import type { FormField } from "@/ui/Form";

const now = Date.now();
const ago = (hours: number) => now - hours * 60 * 60 * 1000;

const workflowFields = [
  { name: "title", label: "案例名称", placeholder: "例如：2026 春季交换院内审批" },
  { name: "owner", label: "负责人", placeholder: "例如：国际处王老师" },
  { name: "status", label: "状态", type: "select", options: [{ label: "进行中", value: "进行中" }, { label: "阻塞中", value: "阻塞中" }, { label: "已完成", value: "已完成" }], defaultValue: "进行中" },
  { name: "summary", label: "案例摘要", type: "textarea", rows: 4, placeholder: "描述当前流程背景、卡点与目标。" },
] satisfies FormField[];

export const processAssistantPageData = {
  headline: "事务处理助手",
  subtitle: "案例总览、步骤泳道、异常补救、AI 纠偏",
  description: "把审批、补件、申报、请假和院系流程拆成可执行步骤。",
  metrics: [
    { label: "活跃案例", value: "18", detail: "3 个进入风险阶段" },
    { label: "本周补件", value: "7", detail: "2 个已完成闭环" },
    { label: "平均办结时间", value: "2.4 天", detail: "较上周下降 0.6 天" },
  ],
  createFields: workflowFields,
};

export const processAssistantRecords = [
  {
    id: "process-case-1",
    title: "2026 春季交换院内审批",
    subtitle: "国际处王老师 · 03/28 截止",
    summary: "需要串联学院审核、课程计划确认和推荐顺序收敛。",
    status: "进行中",
    tags: ["交换审批", "课程计划", "高优先"],
    updatedAt: ago(3),
    content: "## 当前卡点\n- 学分转换说明未齐\n- 推荐顺序待学院确认",
    tasks: [
      { id: "p1", title: "收齐课程计划", done: true, detail: "已收到 3 份计划。", priority: "high" as const },
      { id: "p2", title: "学院签字确认", done: false, detail: "需在 03/28 前完成。", priority: "high" as const },
      { id: "p3", title: "发送补件提醒", done: false, detail: "定向提醒缺材料学生。", priority: "medium" as const },
    ],
    resources: [
      { id: "r1", title: "补件模板", kind: "模板", summary: "用于生成统一补件提醒。" },
      { id: "r2", title: "课程计划说明", kind: "说明", summary: "供学院审核学分转换时参考。" },
    ],
  },
  {
    id: "process-case-2",
    title: "奖学金申请补件流程",
    subtitle: "学工办李老师 · 04/02 截止",
    summary: "集中处理电子材料格式不符和签字缺失问题。",
    status: "阻塞中",
    tags: ["奖学金", "补件", "风险"],
    updatedAt: ago(11),
    content: "## 异常说明\n- 资金证明格式不统一\n- 缺签字页",
    tasks: [
      { id: "p4", title: "核对必交材料", done: false, detail: "补齐 PDF 命名规范。", priority: "high" as const },
      { id: "p5", title: "集中回访学生", done: false, detail: "按风险等级分类提醒。", priority: "medium" as const },
    ],
    resources: [],
  },
];

export const processAssistantQuickActions = [
  {
    id: "process-action-1",
    title: "生成步骤清单",
    description: "把当前案例拆成角色化步骤。",
    prompt: "请根据当前案例生成角色化办理步骤，并标出风险节点。",
    action: "copy_prompt" as const,
  },
  {
    id: "process-action-2",
    title: "输出补救方案",
    description: "针对异常项生成下一步动作。",
    prompt: "请针对当前异常记录，输出 3 条最可执行的补救动作。",
    action: "append_prompt" as const,
  },
];

export const announcementGeneratorPageData = {
  headline: "通知与公告生成",
  subtitle: "历史记录、多渠道输出、对话润色、版本沉淀",
  description: "统一处理学院通知、学生公告、FAQ 补充与移动端短版。",
  metrics: [
    { label: "本周通知", value: "9", detail: "3 条已发布到多渠道" },
    { label: "待终审", value: "2", detail: "均为研究生事务通知" },
    { label: "FAQ 草稿", value: "14", detail: "可直接拼接到公告后部" },
  ],
  createFields: [
    { name: "title", label: "通知标题", placeholder: "例如：2026 春季交换项目报名通知" },
    { name: "audience", label: "通知对象", placeholder: "例如：2023 级和 2024 级本科生" },
    { name: "channel", label: "发布渠道", type: "select", options: [{ label: "邮件 + 公众号", value: "邮件 + 公众号" }, { label: "官网 + 群通知", value: "官网 + 群通知" }], defaultValue: "邮件 + 公众号" },
    { name: "summary", label: "通知摘要", type: "textarea", rows: 4, placeholder: "填入关键时间节点、材料要求和口径说明。" },
  ] satisfies FormField[],
};

export const announcementGeneratorRecords = [
  {
    id: "announcement-1",
    title: "2026 春季交换项目报名通知",
    subtitle: "国际处 · 邮件 + 公众号",
    summary: "覆盖报名资格、时间节点、材料要求和咨询方式。",
    status: "已发布",
    tags: ["国际交流", "FAQ", "需附件"],
    updatedAt: ago(5),
    content: "## 正式通知\n各位同学：\n现启动 2026 春季交换项目报名工作……",
    templates: [
      { id: "announcement-template-1", title: "正式通知模板", summary: "适合官网、群通知与邮件正文。", content: "## 正式通知\n### 适用对象\n### 时间节点\n### 材料清单\n### 联系方式\n" },
      { id: "announcement-template-2", title: "FAQ 模板", summary: "适合附在通知后部。", content: "## FAQ\n### GPA 如何计算？\n### 材料如何命名？\n" },
    ],
  },
  {
    id: "announcement-2",
    title: "研究生中期考核提醒",
    subtitle: "研究生院 · 官网 + 群通知",
    summary: "提醒各学院按时完成材料提交与系统填报。",
    status: "待终审",
    tags: ["研究生事务", "系统填报"],
    updatedAt: ago(26),
    content: "## 中期考核提醒\n请各学院在规定时间内完成……",
    templates: [],
  },
];

export const announcementGeneratorQuickActions = [
  {
    id: "announcement-action-1",
    title: "生成 FAQ",
    description: "补齐资格边界和材料命名说明。",
    prompt: "请基于当前通知生成 FAQ，覆盖资格边界、材料格式和咨询方式。",
    action: "copy_prompt" as const,
  },
  {
    id: "announcement-action-2",
    title: "生成公众号短版",
    description: "压缩成适合手机阅读的版本。",
    prompt: "请把当前通知压缩成公众号短版，保留最关键时间节点和材料提醒。",
    action: "copy_prompt" as const,
  },
];

export const materialsCenterPageData = {
  headline: "材料与表单管理",
  subtitle: "材料集合、审核状态、模板归档、补件追踪",
  description: "统一管理各类材料模板、提交状态和补件闭环。",
  metrics: [
    { label: "材料集合", value: "6", detail: "覆盖交换、奖学金、竞赛等事务" },
    { label: "待审核材料", value: "21", detail: "7 条需要补件" },
    { label: "模板版本", value: "14", detail: "近一周新增 2 个表单版本" },
  ],
  createFields: [
    { name: "title", label: "集合名称", placeholder: "例如：2026 春季交换报名材料" },
    { name: "owner", label: "维护部门", placeholder: "例如：国际处" },
    { name: "summary", label: "集合说明", type: "textarea", rows: 4, placeholder: "描述该集合对应业务和审核要求。" },
  ] satisfies FormField[],
};

export const materialsCenterRecords = [
  {
    id: "materials-1",
    title: "2026 春季交换报名材料",
    subtitle: "国际处 · 必交 6 项",
    summary: "成绩单、语言成绩、课程计划、推荐材料等。",
    status: "审核中",
    tags: ["交换项目", "模板齐全"],
    updatedAt: ago(4),
    content: "## 材料集合\n- 成绩单\n- 语言成绩\n- 报名表\n- 课程计划",
    resources: [
      { id: "mr1", title: "报名表模板", kind: "模板", summary: "支持直接下载和预览。" },
      { id: "mr2", title: "缺件清单", kind: "清单", summary: "当前待补件学生名单。" },
    ],
  },
  {
    id: "materials-2",
    title: "奖学金申请表单包",
    subtitle: "学工办 · 必交 4 项",
    summary: "包含申请表、个人陈述、证明材料和签字页。",
    status: "待补件",
    tags: ["奖学金", "签字要求"],
    updatedAt: ago(18),
    content: "## 补件说明\n当前主要缺少签字页与资金证明。",
    resources: [],
  },
];

export const materialsCenterQuickActions = [
  {
    id: "materials-action-1",
    title: "生成补件说明",
    description: "把缺件问题改写成统一通知。",
    prompt: "请根据当前材料集合生成一段学生可直接理解的补件说明。",
    action: "copy_prompt" as const,
  },
  {
    id: "materials-action-2",
    title: "导出审核摘要",
    description: "整理当前审核状态给老师查看。",
    prompt: "请把当前审核状态压缩成一个适合老师快速浏览的摘要。",
    action: "append_prompt" as const,
  },
];

export const studentQAPageData = {
  headline: "学生问答助手",
  subtitle: "线程会话、FAQ 树、建议回复、知识沉淀",
  description: "把高频问答沉淀成结构化 FAQ，并支持继续 AI 追问。",
  metrics: [
    { label: "待回复线程", value: "8", detail: "材料与交换问题占比最高" },
    { label: "本周新 FAQ", value: "5", detail: "补齐了成绩单、语言成绩相关说明" },
    { label: "平均响应时间", value: "6 min", detail: "FAQ 命中后进一步下降" },
  ],
  createFields: [
    { name: "title", label: "问题标题", placeholder: "例如：成绩单是否需要英文版" },
    { name: "student", label: "提问人", placeholder: "例如：王同学" },
    { name: "summary", label: "问题描述", type: "textarea", rows: 4, placeholder: "补充学生提问的原始上下文。" },
  ] satisfies FormField[],
};

export const studentQARecords = [
  {
    id: "qa-1",
    title: "成绩单是否需要英文版",
    subtitle: "王同学 · 交换项目材料",
    summary: "想确认成绩单是否必须用学校官方英文版。",
    status: "待回复",
    tags: ["成绩单", "交换材料"],
    updatedAt: ago(1),
    content: "## 标准回复\n建议优先使用学校官方英文成绩单……",
    faqTree: [
      { title: "成绩单", answer: "优先使用学校官方英文版。", active: true },
      { title: "语言成绩", answer: "确认成绩有效期和送分要求。", active: false },
    ],
  },
  {
    id: "qa-2",
    title: "课程替换需要哪些材料",
    subtitle: "李明 · 学分认定",
    summary: "需要课程 syllabus 和认定说明。",
    status: "已解决",
    tags: ["学分认定", "课程替换"],
    updatedAt: ago(9),
    content: "## 回复草稿\n需要准备中英文 syllabus、学分认定表和课程替换说明。",
    faqTree: [],
  },
];

export const studentQAQuickActions = [
  {
    id: "qa-action-1",
    title: "生成建议回复",
    description: "保持礼貌、简洁和可执行。",
    prompt: "请针对当前学生问题生成一段礼貌、简洁、可执行的回复。",
    action: "copy_prompt" as const,
  },
  {
    id: "qa-action-2",
    title: "保存为 FAQ 草稿",
    description: "把当前回复改写成标准 FAQ。",
    prompt: "请把当前回复改写成 FAQ 条目，包含问题、简答和补充说明。",
    action: "append_prompt" as const,
  },
];

export const dashboardPageData = {
  headline: "数据统计与看板",
  subtitle: "完成率、趋势、告警、洞察会话",
  description: "把事务负载、响应效率和风险点集中到统一驾驶舱。",
  metrics: [
    { label: "本周待办", value: "18", detail: "材料审核、公告发布与审批跟进" },
    { label: "按时完成率", value: "91%", detail: "较上周提升 5%" },
    { label: "逾期任务", value: "3", detail: "集中在补件环节" },
  ],
};

export const dashboardRecords = [
  {
    id: "insight-1",
    title: "本周事务负载分析",
    subtitle: "最近更新 12 分钟前",
    summary: "逾期任务集中在补件环节，建议前置 48 小时提醒。",
    status: "已生成",
    tags: ["周报", "提醒优化"],
    updatedAt: ago(2),
    content: "## 洞察摘要\n- 补件环节逾期最集中\n- FAQ 命中后咨询量下降",
  },
];

export const dashboardQuickActions = [
  {
    id: "dashboard-action-1",
    title: "生成本周分析",
    description: "基于当前指标生成洞察摘要。",
    prompt: "请根据当前指标生成一份本周管理分析，包含异常点和行动建议。",
    action: "copy_prompt" as const,
  },
];

export const timelinePageData = {
  headline: "时间节点管理",
  subtitle: "关键节点、提醒策略、冲突消解、AI 排期",
  description: "统一管理报名、审批、补件、面试和发布节奏。",
  metrics: [
    { label: "高优先节点", value: "4", detail: "2 个已进入临近状态" },
    { label: "自动提醒", value: "11", detail: "含 3 条定向提醒" },
    { label: "冲突事件", value: "2", detail: "需要协调学院和学生时间" },
  ],
};

export const timelineRecords = [
  {
    id: "timeline-1",
    title: "2026 春季国际交流事务时间轴",
    subtitle: "国际处 · 18 个节点",
    summary: "覆盖报名、补件、审批和提名通知。",
    status: "进行中",
    tags: ["国际交流", "高频提醒"],
    updatedAt: ago(3),
    content: "## 关键节点\n- 03/25 宣讲\n- 03/28 院系审批\n- 04/08 材料汇总",
    milestones: [
      { id: "tm1", title: "交换项目院内宣讲", summary: "面向学生说明整体节奏。", date: "03/25", status: "doing" as const },
      { id: "tm2", title: "本科竞赛报名截止", summary: "需发送高优先提醒。", date: "03/28", status: "risk" as const },
      { id: "tm3", title: "中期考核材料汇总", summary: "准备归档。", date: "04/08", status: "todo" as const },
    ],
  },
];

export const timelineQuickActions = [
  {
    id: "timeline-action-1",
    title: "重排未来三天提醒",
    description: "根据风险节点生成提醒方案。",
    prompt: "请根据当前时间轴风险节点，输出未来三天的提醒安排。",
    action: "copy_prompt" as const,
  },
];
