import type { FormField } from "@/ui/Form";

const now = Date.now();
const ago = (hours: number) => now - hours * 60 * 60 * 1000;

const exchangeForm = [
  { name: "title", label: "记录名称", placeholder: "例如：UBC 交换项目分析" },
  { name: "summary", label: "当前目标", type: "textarea", rows: 4, placeholder: "写下当前需要推进的项目或支持目标。" },
] satisfies FormField[];

export const exchangeHubPageData = {
  headline: "项目目录页",
  subtitle: "项目搜索、候选池、项目预览、比较托盘、项目助手",
  description: "在一个页面里完成项目筛选、预览、收藏、比较和进入后续流程。",
  metrics: [
    { label: "项目池", value: "42", detail: "本周新增 3 个暑校项目" },
    { label: "已收藏", value: "7", detail: "其中 3 个进入比较托盘" },
    { label: "临近截止", value: "4", detail: "UBC、NUS 与 KU Leuven 在列" },
  ],
  createFields: exchangeForm,
};

export const exchangeHubRecords = [
  {
    id: "program-ubc",
    title: "University of British Columbia Exchange",
    subtitle: "Canada · 学费互免",
    summary: "适合 HCI / CS 背景学生，课程选择灵活，学分转换经验成熟。",
    status: "开放申请",
    tags: ["Canada", "Exchange", "CS/HCI"],
    updatedAt: ago(1),
    content: "## 项目摘要\n- GPA 3.3+\n- TOEFL 90+\n- 校内审批 + 提名\n",
    timeline: [
      { id: "eh1", title: "校内报名开放", summary: "填写项目申请表。", date: "03/22", status: "doing" as const },
      { id: "eh2", title: "院系审批", summary: "提交课程计划。", date: "03/28", status: "todo" as const },
      { id: "eh3", title: "校内截止", summary: "完成全部上传。", date: "04/18", status: "risk" as const },
    ],
    resources: [
      { id: "ex-r1", title: "进入匹配实验室", kind: "联动", summary: "把项目拉进比较矩阵。", to: "/international/matching-lab" },
      { id: "ex-r2", title: "进入流程助手", kind: "联动", summary: "生成个人申请节点。", to: "/international/process-flow" },
    ],
  },
  {
    id: "program-nus",
    title: "NUS Summer School",
    subtitle: "Singapore · 暑校",
    summary: "课程丰富、时间灵活，但整体费用更高。",
    status: "开放申请",
    tags: ["Singapore", "Summer"],
    updatedAt: ago(8),
    content: "## 项目摘要\n- 适合短期体验\n- 需关注费用与宿舍",
    timeline: [],
    resources: [],
  },
];

export const exchangeHubQuickActions = [
  {
    id: "exchange-action-1",
    title: "生成项目摘要",
    description: "把当前项目压缩成便于沟通的纪要。",
    prompt: "请把当前项目压缩成一份 5 行内的申请纪要，包含门槛、费用、风险和推荐理由。",
    action: "copy_prompt" as const,
  },
  {
    id: "exchange-action-2",
    title: "输出比较维度",
    description: "为候选项目生成统一比较表头。",
    prompt: "请为当前候选项目生成比较维度，覆盖课程匹配、预算、风险和时间线。",
    action: "append_prompt" as const,
  },
];

export const matchingLabPageData = {
  headline: "决策实验室",
  subtitle: "画像录入、推荐结果、比较矩阵、决策说明、AI 决策协助",
  description: "把个人画像和项目门槛放到同一张矩阵里，生成可执行的申报优先级。",
  metrics: [
    { label: "活跃分析", value: "5", detail: "2 条分析待锁定优先级" },
    { label: "当前候选", value: "9", detail: "UBC、NUS 与 Leuven 排在前列" },
    { label: "高风险项目", value: "2", detail: "主要因预算或录取难度偏高" },
  ],
  createFields: [
    { name: "title", label: "分析名称", placeholder: "例如：Canada / Singapore 交换分析" },
    { name: "summary", label: "画像摘要", type: "textarea", rows: 4, placeholder: "描述 GPA、语言、预算、国家偏好和课程诉求。" },
  ] satisfies FormField[],
};

export const matchingLabRecords = [
  {
    id: "analysis-1",
    title: "Canada / Singapore 交换分析",
    subtitle: "TOEFL 102 · CS/HCI · 预算中等",
    summary: "希望优先考虑课程匹配度高、预算压力适中、学分转换成熟的项目。",
    status: "进行中",
    tags: ["Canada", "Singapore", "课程匹配"],
    updatedAt: ago(2),
    content: "## 当前排序\n1. UBC Exchange\n2. NUS Summer School\n3. KU Leuven Joint Training",
    recommendations: [
      { title: "UBC Exchange", reason: "课程匹配度高、学费互免、风险适中。", score: "92" },
      { title: "NUS Summer School", reason: "时间灵活，但费用更高。", score: "84" },
      { title: "KU Leuven Joint Training", reason: "研究 fit 高，但流程更复杂。", score: "78" },
    ],
    resources: [
      { id: "ml-r1", title: "进入项目中心", kind: "联动", summary: "查看原始项目信息。", to: "/international/exchange-hub" },
      { id: "ml-r2", title: "生成流程计划", kind: "联动", summary: "把第一志愿转成流程节点。", to: "/international/process-flow" },
    ],
  },
];

export const matchingLabQuickActions = [
  {
    id: "matching-action-1",
    title: "锁定优先级说明",
    description: "给导师或老师输出一版解释稿。",
    prompt: "请为当前项目优先级排序生成一版解释稿，重点说明取舍逻辑。",
    action: "copy_prompt" as const,
  },
];

export const processFlowPageData = {
  headline: "申请指挥板",
  subtitle: "阶段地图、计划卡、任务清单、里程碑、风险提醒、流程 AI",
  description: "把申请节点拆成真正可执行的计划与提醒。",
  metrics: [
    { label: "待完成任务", value: "18", detail: "4 项进入高优先状态" },
    { label: "风险节点", value: "3", detail: "院系审批、推荐信与成绩单最紧" },
    { label: "里程碑", value: "7", detail: "已完成 2 个" },
  ],
  createFields: exchangeForm,
};

export const processFlowRecords = [
  {
    id: "plan-1",
    title: "UBC Exchange 申请计划",
    subtitle: "2026 秋季 · 当前阶段为院系审批",
    summary: "把校内审批、提名、成绩单与语言成绩上传对齐成一条主线。",
    status: "进行中",
    tags: ["UBC", "审批", "推荐信"],
    updatedAt: ago(1),
    content: "## 风险提示\n- 推荐信尚未确认\n- 院系审批需在 03/28 前完成",
    tasks: [
      { id: "pf1", title: "提交院系审批表", done: false, detail: "附课程计划与学分说明。", priority: "high" as const },
      { id: "pf2", title: "确认推荐信老师", done: false, detail: "今日内发出邀请。", priority: "high" as const },
      { id: "pf3", title: "检查成绩单上传", done: true, detail: "已准备盖章版 PDF。", priority: "medium" as const },
    ],
    milestones: [
      { id: "pfm1", title: "校内报名开放", summary: "已开始填写。", date: "03/22", status: "doing" as const },
      { id: "pfm2", title: "院系审批截止", summary: "最关键节点。", date: "03/28", status: "risk" as const },
      { id: "pfm3", title: "校内申请截止", summary: "需全部上传完成。", date: "04/18", status: "todo" as const },
    ],
  },
];

export const processFlowQuickActions = [
  {
    id: "process-action-1",
    title: "生成三日行动计划",
    description: "根据风险节点压缩下一步计划。",
    prompt: "请基于当前风险节点生成未来三天的行动计划，并标出依赖关系。",
    action: "copy_prompt" as const,
  },
];

export const writingDeskPageData = {
  headline: "沟通写作台",
  subtitle: "历史记录、双语草稿、模板抽屉、发送前检查、沟通 AI",
  description: "把导师联系、住宿沟通、签证说明和 FAQ 统一收敛到沟通工作台。",
  metrics: [
    { label: "历史草稿", value: "12", detail: "4 条最近一周被继续编辑" },
    { label: "双语模板", value: "9", detail: "导师联系与 arrival notice 最常用" },
    { label: "发送前检查", value: "5", detail: "附件说明与 closing 最常遗漏" },
  ],
  createFields: [
    { name: "title", label: "沟通主题", placeholder: "例如：导师联系邮件" },
    { name: "summary", label: "核心需求", type: "textarea", rows: 4, placeholder: "补充对象、语气、语言和核心诉求。" },
  ] satisfies FormField[],
};

export const writingDeskRecords = [
  {
    id: "draft-1",
    title: "导师联系邮件 · UBC 访学咨询",
    subtitle: "中英双语 · 海外导师",
    summary: "围绕 HCI / AI 研究兴趣和访学背景生成首封联系邮件。",
    status: "进行中",
    tags: ["导师联系", "双语"],
    updatedAt: ago(2),
    content: "## English Draft\nDear Professor...\n\n## 中文对照\n尊敬的老师：\n",
    templates: [
      { id: "wd1", title: "导师联系模板", summary: "适合初次沟通。", content: "Dear Professor,\nI hope this message finds you well...\n" },
      { id: "wd2", title: "住房沟通模板", summary: "适合和宿舍办公室联系。", content: "Hello Housing Office,\nI would like to ask about...\n" },
    ],
  },
];

export const writingDeskQuickActions = [
  {
    id: "writing-desk-action-1",
    title: "生成更礼貌 opening",
    description: "把 opening 改得更自然更专业。",
    prompt: "请把当前邮件 opening 改得更礼貌、更简洁，并保留交流 / 访学背景。",
    action: "copy_prompt" as const,
  },
];

export const preDeparturePageData = {
  headline: "出发准备板",
  subtitle: "准备案例、checklist、文件包校验、提醒区、行前 AI",
  description: "围绕签证、保险、住宿、机票和落地准备生成可勾选的出发计划。",
  metrics: [
    { label: "行前案例", value: "4", detail: "2 条进入证件校验阶段" },
    { label: "关键缺口", value: "3", detail: "签证、保险与住宿最常见" },
    { label: "文件包", value: "8", detail: "含护照、签证、offer 与保险单" },
  ],
  createFields: exchangeForm,
};

export const preDepartureRecords = [
  {
    id: "prep-1",
    title: "Canada 交换行前清单",
    subtitle: "2026 秋季 · 预计 8 月出发",
    summary: "以签证、保险、住宿和银行卡准备为主线。",
    status: "准备中",
    tags: ["Canada", "visa", "insurance"],
    updatedAt: ago(5),
    content: "## 当前重点\n- 检查签证材料\n- 比较保险方案\n- 锁定首晚住宿",
    tasks: [
      { id: "pd1", title: "准备签证材料", done: false, detail: "检查护照有效期、学校文件和资金证明。", priority: "high" as const },
      { id: "pd2", title: "确认保险要求", done: false, detail: "比较校内保险和自购保险。", priority: "high" as const },
      { id: "pd3", title: "处理住宿", done: true, detail: "校内宿舍已提交申请。", priority: "medium" as const },
    ],
    resources: [
      { id: "pd-r1", title: "应急联系卡", kind: "卡片", summary: "出发前需要打印与保存。" },
    ],
  },
];

export const preDepartureQuickActions = [
  {
    id: "predeparture-action-1",
    title: "生成打包清单",
    description: "按国家和学期输出行李建议。",
    prompt: "请根据当前国家、学期和项目类型生成一个详细打包清单。",
    action: "copy_prompt" as const,
  },
];

export const welcomePortalPageData = {
  headline: "来华支持台",
  subtitle: "support profile、guide/FAQ/task、notice 预览、双语支持 AI",
  description: "围绕 incoming students 的 arrival、报到、宿舍和校园办事提供一站式支持。",
  metrics: [
    { label: "支持档案", value: "8", detail: "2 位学生将在下周 arrival" },
    { label: "待补 FAQ", value: "14", detail: "宿舍与就医说明最紧缺" },
    { label: "本周通知", value: "3", detail: "均需中英双语版本" },
  ],
  createFields: exchangeForm,
};

export const welcomePortalRecords = [
  {
    id: "welcome-1",
    title: "Anna Lee · 新加坡交换生支持档案",
    subtitle: "arrival / 报到注册阶段",
    summary: "需要中英双语 onboarding notice，并补宿舍入住和校园卡 FAQ。",
    status: "支持中",
    tags: ["Singapore", "arrival", "housing"],
    updatedAt: ago(3),
    content: "## 当前缺口\n- 中英双语 notice\n- 宿舍入住说明\n- 校园卡激活 FAQ",
    faqTree: [
      { title: "宿舍入住", answer: "到校后先前往指定宿舍办理入住。", active: true },
      { title: "校园卡", answer: "报到完成后到服务大厅激活。", active: false },
    ],
    tasks: [
      { id: "wp1", title: "生成 onboarding notice", done: false, detail: "中英双语并排版本。", priority: "high" as const },
      { id: "wp2", title: "补齐生活 FAQ", done: false, detail: "覆盖地图、支付和就医。", priority: "medium" as const },
    ],
  },
];

export const welcomePortalQuickActions = [
  {
    id: "welcome-action-1",
    title: "生成双语 onboarding notice",
    description: "把当前档案直接转成学生通知。",
    prompt: "请基于当前来华支持档案生成中英双语 onboarding notice。",
    action: "copy_prompt" as const,
  },
];

export const culturalTrainingPageData = {
  headline: "培训地图页",
  subtitle: "画像概览、模块进度、风险笔记、资源区、适应建议 AI",
  description: "以情境化的方式提示学术礼仪、课堂参与、当地法律与安全风险。",
  metrics: [
    { label: "培训画像", value: "6", detail: "2 位学生需要强化安全模块" },
    { label: "待完成模块", value: "9", detail: "课堂参与与法律规则占比高" },
    { label: "风险备注", value: "4", detail: "夜间出行与兼职边界最常被追问" },
  ],
  createFields: exchangeForm,
};

export const culturalTrainingRecords = [
  {
    id: "culture-1",
    title: "加拿大交换生适应训练画像",
    subtitle: "课堂参与 + 学术礼仪优先",
    summary: "重点补课堂发言、office hour、引用规范和夜间安全。",
    status: "进行中",
    tags: ["Canada", "academic", "safety"],
    updatedAt: ago(6),
    content: "## 当前重点\n- 课堂参与礼仪\n- 学术诚信\n- 夜间安全",
    modules: [
      { title: "课堂参与", progress: "70%" },
      { title: "学术诚信", progress: "40%" },
      { title: "安全与应急", progress: "55%" },
    ],
    resources: [
      { id: "ct-r1", title: "跨文化情境卡", kind: "资源", summary: "用于讨论课堂与生活情境。" },
    ],
  },
];

export const culturalTrainingQuickActions = [
  {
    id: "culture-action-1",
    title: "生成适应建议",
    description: "根据当前画像输出提醒。",
    prompt: "请根据当前画像生成 5 条可执行的跨文化适应建议。",
    action: "copy_prompt" as const,
  },
];

export const abroadLifePageData = {
  headline: "在外支持中心",
  subtitle: "support tickets、life guide、emergency cards、check-in、海外支持 AI",
  description: "把课程调整、住房续租、签证续办和夜间突发支持整合到一个中心。",
  metrics: [
    { label: "活跃工单", value: "12", detail: "4 条与课程调整相关" },
    { label: "应急卡", value: "6", detail: "覆盖证件遗失、夜间突发等场景" },
    { label: "本周 check-in", value: "9", detail: "2 位学生处于高风险状态" },
  ],
  createFields: exchangeForm,
};

export const abroadLifeRecords = [
  {
    id: "ticket-1",
    title: "课程替换与学分认定支持",
    subtitle: "UBC 在外阶段 · 当前待老师确认",
    summary: "学生希望更换课程，需同步院系认定和宿舍合同安排。",
    status: "处理中",
    tags: ["course change", "housing"],
    updatedAt: ago(4),
    content: "## 当前问题\n- 课程替换需 syllabus\n- 宿舍续住尚未决策",
    emergencyCards: [
      { title: "证件遗失", summary: "先冻结卡证，再联系学校与领馆。" },
      { title: "夜间突发", summary: "先保障安全，再联系学校安保和 buddy。" },
    ],
    resources: [
      { id: "ab-r1", title: "在外地址更新说明", kind: "指南", summary: "涉及学校和签证地址同步。" },
    ],
  },
];

export const abroadLifeQuickActions = [
  {
    id: "abroad-action-1",
    title: "输出应急步骤",
    description: "针对当前场景生成应急流程。",
    prompt: "请针对当前在外支持场景，输出一版紧急处理步骤和联系人顺序。",
    action: "copy_prompt" as const,
  },
];

export const returnServicePageData = {
  headline: "回国收尾页",
  subtitle: "报销、归档、反思、结案四面板与返校 AI",
  description: "返校后的学分认定、报销归档和经验回流在这里完成。",
  metrics: [
    { label: "返校案例", value: "5", detail: "2 条正处于学分认定阶段" },
    { label: "报销单", value: "3", detail: "1 单待补发票" },
    { label: "经验沉淀", value: "4", detail: "准备转成 FAQ 与分享稿" },
  ],
  createFields: exchangeForm,
};

export const returnServiceRecords = [
  {
    id: "return-1",
    title: "UBC 交换返校归档",
    subtitle: "学分认定 + 报销 + 经验分享",
    summary: "需要同步成绩单、课程大纲、报销票据和经验回流。",
    status: "处理中",
    tags: ["credit transfer", "reimbursement"],
    updatedAt: ago(7),
    content: "## 返校优先事项\n- 学分认定\n- 报销归档\n- FAQ 与分享准备",
    tasks: [
      { id: "rs1", title: "提交学分认定材料", done: false, detail: "成绩单、课程大纲与说明。", priority: "high" as const },
      { id: "rs2", title: "整理报销票据", done: false, detail: "补齐机票与住宿发票。", priority: "medium" as const },
      { id: "rs3", title: "沉淀经验 FAQ", done: true, detail: "已形成初稿。", priority: "low" as const },
    ],
    resources: [
      { id: "rs-r1", title: "分享提纲模板", kind: "模板", summary: "面向下一届交换学生。 " },
    ],
  },
];

export const returnServiceQuickActions = [
  {
    id: "return-action-1",
    title: "生成返校 closing 清单",
    description: "把剩余事项按优先级重排。",
    prompt: "请根据当前返校案例，按优先级生成 closing 清单和建议完成时间。",
    action: "copy_prompt" as const,
  },
];
