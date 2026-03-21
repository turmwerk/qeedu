import React from "react";
import type { Feature } from "@/feature/ModuleHub";
import {
  BankOutlinedIcon,
  DeploymentUnitOutlinedIcon,
  EnvironmentOutlinedIcon,
  GlobalOutlinedIcon,
  MailOutlinedIcon,
  RocketOutlinedIcon,
  RollbackOutlinedIcon,
  SafetyOutlinedIcon,
  SearchOutlinedIcon,
  TranslationOutlinedIcon,
} from "@/ui/Icon";

type ModuleCatalogEntry = {
  key: string;
  title: string;
  shortLabel: string;
  desc: string;
  details: string[];
  to: string;
  workspaceTo?: string;
  icon: React.ReactNode;
  badgeLabel: string;
  footerLabel: string;
  landingHeadline: string;
  landingSubtitle: string;
  landingFeatures: Feature[];
};

const entry = (value: ModuleCatalogEntry): ModuleCatalogEntry => value;

export const internationalModuleCatalog: ModuleCatalogEntry[] = [
  entry({
    key: "international-exchange-hub",
    title: "交换与访学项目中心",
    shortLabel: "项目中心",
    desc: "项目搜索、预览、比较托盘和流程联动。",
    details: ["项目搜索", "项目预览", "比较托盘", "流程联动"],
    to: "/international/exchange-hub",
    workspaceTo: "/international/exchange-hub",
    icon: <GlobalOutlinedIcon />,
    badgeLabel: "Projects",
    footerLabel: "项目目录页",
    landingHeadline: "项目目录页",
    landingSubtitle: "完成项目筛选、预览、收藏和比较，再决定是否进入匹配和申请流程。",
    landingFeatures: [
      { key: "exchange-grid", title: "项目目录", desc: "查看项目清单与门槛。", to: "/international/exchange-hub", icon: <BankOutlinedIcon />, badgeLabel: "Directory", footerLabel: "浏览项目" },
      { key: "exchange-compare", title: "比较托盘", desc: "把候选项目放进统一比较视图。", to: "/international/exchange-hub", icon: <SearchOutlinedIcon />, badgeLabel: "Compare", footerLabel: "比较项目" },
      { key: "exchange-process", title: "衔接流程", desc: "把候选项目转成后续申请计划。", to: "/international/process-flow", icon: <DeploymentUnitOutlinedIcon />, badgeLabel: "Flow", footerLabel: "进入流程" },
    ],
  }),
  entry({
    key: "international-matching-lab",
    title: "智能项目匹配与申请决策",
    shortLabel: "项目匹配",
    desc: "画像录入、推荐结果、比较矩阵和决策说明。",
    details: ["画像录入", "推荐结果", "比较矩阵", "决策说明"],
    to: "/international/matching-lab",
    workspaceTo: "/international/matching-lab/analyses/new",
    icon: <SearchOutlinedIcon />,
    badgeLabel: "Matching",
    footerLabel: "决策实验室",
    landingHeadline: "决策实验室",
    landingSubtitle: "把个人画像、项目门槛和风险偏好拉到同一张矩阵中，输出可执行的排序。",
    landingFeatures: [
      { key: "matching-profile", title: "新建分析", desc: "录入 GPA、语言、预算和偏好。", to: "/international/matching-lab/analyses/new", icon: <SearchOutlinedIcon />, badgeLabel: "Profile", footerLabel: "开始分析" },
      { key: "matching-results", title: "推荐结果", desc: "查看项目排序和原因。", to: "/international/matching-lab", icon: <BankOutlinedIcon />, badgeLabel: "Ranking", footerLabel: "查看排序" },
      { key: "matching-output", title: "决策说明稿", desc: "把排序理由输出给老师或家长。", to: "/international/writing-desk", icon: <MailOutlinedIcon />, badgeLabel: "Output", footerLabel: "生成说明" },
    ],
  }),
  entry({
    key: "international-process-flow",
    title: "申请流程助手",
    shortLabel: "流程助手",
    desc: "阶段地图、任务清单、里程碑和风险提醒。",
    details: ["阶段地图", "任务清单", "里程碑", "风险提醒"],
    to: "/international/process-flow",
    workspaceTo: "/international/process-flow",
    icon: <DeploymentUnitOutlinedIcon />,
    badgeLabel: "Flow",
    footerLabel: "申请指挥板",
    landingHeadline: "申请指挥板",
    landingSubtitle: "围绕项目计划生成真正能执行的任务链、提醒链和里程碑。",
    landingFeatures: [
      { key: "process-plan", title: "计划总览", desc: "查看申请阶段地图。", to: "/international/process-flow", icon: <DeploymentUnitOutlinedIcon />, badgeLabel: "Plan", footerLabel: "总览计划" },
      { key: "process-risk", title: "风险节点", desc: "重点处理审批和补件风险。", to: "/international/process-flow", icon: <SafetyOutlinedIcon />, badgeLabel: "Risk", footerLabel: "处理风险" },
      { key: "process-reminders", title: "提醒策略", desc: "自动生成 T-3 / T-1 提醒。", to: "/international/process-flow", icon: <RocketOutlinedIcon />, badgeLabel: "Reminder", footerLabel: "发送提醒" },
    ],
  }),
  entry({
    key: "international-writing-desk",
    title: "多语言沟通与邮件助手",
    shortLabel: "邮件助手",
    desc: "双语草稿、模板抽屉、发送前检查和沟通对话。",
    details: ["双语草稿", "模板抽屉", "发送前检查", "沟通对话"],
    to: "/international/writing-desk",
    workspaceTo: "/international/writing-desk/drafts/new",
    icon: <MailOutlinedIcon />,
    badgeLabel: "Writing",
    footerLabel: "沟通写作台",
    landingHeadline: "沟通写作台",
    landingSubtitle: "统一管理导师联系、住宿沟通、签证说明和双语 FAQ 草稿。",
    landingFeatures: [
      { key: "writing-new", title: "新建草稿", desc: "从沟通场景直接生成双语草稿。", to: "/international/writing-desk/drafts/new", icon: <MailOutlinedIcon />, badgeLabel: "Draft", footerLabel: "开始写作" },
      { key: "writing-templates", title: "模板抽屉", desc: "调用导师联系和住宿模板。", to: "/international/writing-desk", icon: <TranslationOutlinedIcon />, badgeLabel: "Template", footerLabel: "调用模板" },
      { key: "writing-check", title: "发送前检查", desc: "检查附件、opening 和 closing。", to: "/international/writing-desk", icon: <DeploymentUnitOutlinedIcon />, badgeLabel: "Checklist", footerLabel: "准备发送" },
    ],
  }),
  entry({
    key: "international-pre-departure",
    title: "行前准备助手",
    shortLabel: "行前准备",
    desc: "准备案例、证件校验、文件包和行前提醒。",
    details: ["准备案例", "证件校验", "文件包", "行前提醒"],
    to: "/international/pre-departure",
    workspaceTo: "/international/pre-departure",
    icon: <RocketOutlinedIcon />,
    badgeLabel: "Departure",
    footerLabel: "出发准备板",
    landingHeadline: "出发准备板",
    landingSubtitle: "把签证、保险、住宿、机票和落地准备拆成可勾选的倒计时工作区。",
    landingFeatures: [
      { key: "pre-docs", title: "证件核验", desc: "检查护照、签证与保险。", to: "/international/pre-departure", icon: <RocketOutlinedIcon />, badgeLabel: "Docs", footerLabel: "检查证件" },
      { key: "pre-pack", title: "文件包", desc: "整理出发前必要材料。", to: "/international/pre-departure", icon: <MailOutlinedIcon />, badgeLabel: "Pack", footerLabel: "整理文件包" },
      { key: "pre-risk", title: "出发提醒", desc: "输出最后一周的行前提醒。", to: "/international/pre-departure", icon: <SafetyOutlinedIcon />, badgeLabel: "Risk", footerLabel: "发送提醒" },
    ],
  }),
  entry({
    key: "international-cultural-training",
    title: "跨文化培训与风险提示",
    shortLabel: "跨文化培训",
    desc: "画像概览、模块进度、风险备注和适应建议。",
    details: ["画像概览", "模块进度", "风险备注", "适应建议"],
    to: "/international/cultural-training",
    workspaceTo: "/international/cultural-training",
    icon: <TranslationOutlinedIcon />,
    badgeLabel: "Culture",
    footerLabel: "培训地图页",
    landingHeadline: "培训地图页",
    landingSubtitle: "围绕学术礼仪、课堂参与、法律规则和安全场景进行情境化训练。",
    landingFeatures: [
      { key: "culture-profile", title: "训练画像", desc: "按项目和国家生成适应画像。", to: "/international/cultural-training", icon: <TranslationOutlinedIcon />, badgeLabel: "Profile", footerLabel: "查看画像" },
      { key: "culture-modules", title: "模块进度", desc: "追踪课堂礼仪与安全模块。", to: "/international/cultural-training", icon: <SlidersOutlinedIconFallback />, badgeLabel: "Progress", footerLabel: "追踪进度" },
      { key: "culture-ai", title: "适应建议", desc: "对接 AI 生成具体建议。", to: "/international/cultural-training", icon: <SafetyOutlinedIcon />, badgeLabel: "Advice", footerLabel: "生成建议" },
      { key: "culture-resource", title: "资源页", desc: "集中查看学术礼仪、安全与适应支持。", to: "/international/cultural-training/resources", icon: <TranslationOutlinedIcon />, badgeLabel: "Resource", footerLabel: "打开资源页" },
    ],
  }),
  entry({
    key: "international-abroad-life",
    title: "在外期间支持",
    shortLabel: "在外支持",
    desc: "support ticket、生活指南、应急卡和海外支持 AI。",
    details: ["支持工单", "生活指南", "应急卡", "海外 AI"],
    to: "/international/abroad-life",
    workspaceTo: "/international/abroad-life",
    icon: <EnvironmentOutlinedIcon />,
    badgeLabel: "Abroad",
    footerLabel: "在外支持中心",
    landingHeadline: "在外支持中心",
    landingSubtitle: "集中处理课程调整、住房续租、签证续办和夜间突发事务。",
    landingFeatures: [
      { key: "abroad-ticket", title: "支持工单", desc: "管理当前海外支持事项。", to: "/international/abroad-life", icon: <EnvironmentOutlinedIcon />, badgeLabel: "Ticket", footerLabel: "查看工单" },
      { key: "abroad-emergency", title: "应急卡", desc: "沉淀证件遗失和夜间突发流程。", to: "/international/abroad-life", icon: <SafetyOutlinedIcon />, badgeLabel: "Emergency", footerLabel: "查看应急卡" },
      { key: "abroad-ai", title: "海外支持 AI", desc: "继续追问课程、住房和应急场景。", to: "/international/abroad-life", icon: <MailOutlinedIcon />, badgeLabel: "AI", footerLabel: "继续对话" },
    ],
  }),
  entry({
    key: "international-return-service",
    title: "回国与成果沉淀",
    shortLabel: "回国收尾",
    desc: "学分认定、报销、归档、经验反思和结案。",
    details: ["学分认定", "报销归档", "经验反思", "结案"],
    to: "/international/return-service",
    workspaceTo: "/international/return-service",
    icon: <RollbackOutlinedIcon />,
    badgeLabel: "Return",
    footerLabel: "回国收尾页",
    landingHeadline: "回国收尾页",
    landingSubtitle: "返校后统一处理学分认定、报销归档和经验回流，不让项目在收尾阶段断掉。",
    landingFeatures: [
      { key: "return-credit", title: "学分认定", desc: "处理成绩单和课程大纲。", to: "/international/return-service", icon: <RollbackOutlinedIcon />, badgeLabel: "Credit", footerLabel: "认定学分" },
      { key: "return-archive", title: "归档与报销", desc: "整理票据和项目证明材料。", to: "/international/return-service", icon: <MailOutlinedIcon />, badgeLabel: "Archive", footerLabel: "整理归档" },
      { key: "return-reflect", title: "经验沉淀", desc: "沉淀 FAQ 和分享稿。", to: "/international/return-service", icon: <SearchOutlinedIcon />, badgeLabel: "Reflect", footerLabel: "经验回流" },
    ],
  }),
  entry({
    key: "international-welcome-portal",
    title: "来华支援助手",
    shortLabel: "来华支持",
    desc: "support profile、FAQ、onboarding notice 和双语支持 AI。",
    details: ["支持档案", "双语 FAQ", "入学通知", "双语 AI"],
    to: "/international/welcome-portal",
    workspaceTo: "/international/welcome-portal",
    icon: <EnvironmentOutlinedIcon />,
    badgeLabel: "Welcome",
    footerLabel: "来华支持台",
    landingHeadline: "来华支持台",
    landingSubtitle: "面向 incoming students 统一处理 arrival、报到、宿舍和校园办事支持。",
    landingFeatures: [
      { key: "welcome-profile", title: "支持档案", desc: "为每位学生创建 support profile。", to: "/international/welcome-portal", icon: <EnvironmentOutlinedIcon />, badgeLabel: "Profile", footerLabel: "管理档案" },
      { key: "welcome-faq", title: "FAQ 与任务", desc: "沉淀双语 FAQ 和首周待办。", to: "/international/welcome-portal", icon: <TranslationOutlinedIcon />, badgeLabel: "FAQ", footerLabel: "补 FAQ" },
      { key: "welcome-notice", title: "双语通知", desc: "生成 onboarding notice 与 arrival 提醒。", to: "/international/writing-desk", icon: <MailOutlinedIcon />, badgeLabel: "Notice", footerLabel: "生成通知" },
    ],
  }),
];

function SlidersOutlinedIconFallback() {
  return <DeploymentUnitOutlinedIcon />;
}

export const internationalHubFeatures: Feature[] = internationalModuleCatalog.map((item) => ({
  key: item.key,
  title: item.title,
  desc: item.desc,
  details: item.details,
  to: item.to,
  icon: item.icon,
  badgeLabel: item.badgeLabel,
  footerLabel: item.footerLabel,
}));

export const internationalHomeSubLinks = internationalModuleCatalog.map((item) => ({
  label: item.shortLabel,
  to: item.to,
  icon: item.icon,
}));

export const getInternationalModuleCatalogEntry = (key: string) => {
  const matched = internationalModuleCatalog.find((item) => item.key === key);
  if (!matched) {
    throw new Error(`Unknown international module catalog key: ${key}`);
  }
  return matched;
};
