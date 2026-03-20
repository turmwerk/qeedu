import React from "react";
import type { Feature } from "@/feature/ModuleHub";
import {
  EditOutlinedIcon,
  FileSearchOutlinedIcon,
  ReadOutlinedIcon,
  SearchOutlinedIcon,
  SlidersOutlinedIcon,
} from "@/ui/Icon";

type ModuleCatalogEntry = {
  key: string;
  title: string;
  shortLabel: string;
  desc: string;
  to: string;
  workspaceTo?: string;
  icon: React.ReactNode;
  badgeLabel: string;
  footerLabel: string;
  subLinks: Feature["subLinks"];
  landingHeadline: string;
  landingSubtitle: string;
  landingFeatures: Feature[];
};

const entry = (
  value: ModuleCatalogEntry,
): ModuleCatalogEntry => value;

export const researchModuleCatalog: ModuleCatalogEntry[] = [
  entry({
    key: "research-literature-search",
    title: "文献检索",
    shortLabel: "文献检索",
    desc: `智能检索与综述助手
• 检索式管理
• 数据库切换
• 样本池初筛与精筛复盘`,
    to: "/research/literature-search",
    workspaceTo: "/research/literature-search/ListPage",
    icon: <SearchOutlinedIcon />,
    badgeLabel: "Search",
    footerLabel: "检索与筛选",
    subLinks: [ 
    ],
    landingHeadline: "文献检索",
    landingSubtitle: "从研究问题拆解、检索式设计到样本池筛选，先把入口做对，后面精读和写作才不跑偏。",
    landingFeatures: [
      {
        key: "search-query",
        title: "检索式与数据库语法",
        desc: "把核心概念、同义词和排除词转换成可复用的数据库检索式。",
        to: "/research/literature-search/ListPage",
        icon: <SearchOutlinedIcon />,
        badgeLabel: "Query",
        footerLabel: "检索式设计",
      },
      {
        key: "search-screening",
        title: "样本池初筛与精筛",
        desc: "区分题名摘要初筛、全文精筛和纳排标准复核，减少无效阅读。",
        to: "/research/literature-search/ListPage",
        icon: <SlidersOutlinedIcon />,
        badgeLabel: "Screening",
        footerLabel: "纳排与筛选",
      },
      {
        key: "search-handoff",
        title: "向精读工作台移交",
        desc: "把高价值论文批量移交到精读阶段，而不是重复抄录文献信息。",
        to: "/research/paper-reader/ListPage",
        icon: <ReadOutlinedIcon />,
        badgeLabel: "Handoff",
        footerLabel: "进入精读",
      },
      {
        key: "search-review",
        title: "综述结构与主题簇",
        desc: "按方法、任务、数据集和时间线聚合样本，为后续写作提供骨架。",
        to: "/research/paper-writing/ListPage",
        icon: <EditOutlinedIcon />,
        badgeLabel: "Review",
        footerLabel: "综述骨架",
      },
    ],
  }),
  entry({
    key: "research-paper-reader",
    title: "论文精读",
    shortLabel: "论文精读",
    desc: `智能文献阅读器
• 结构化读论文
• 提炼贡献与方法
• 沉淀复现清单`,
    to: "/research/paper-reader",
    workspaceTo: "/research/paper-reader/ListPage",
    icon: <ReadOutlinedIcon />,
    badgeLabel: "Reader",
    footerLabel: "结构化精读",
    subLinks: [

    ],
    landingHeadline: "论文精读",
    landingSubtitle: "不是把论文从头到尾复述一遍，而是把问题定义、核心方法、实验结论和可复用思路拆出来。",
    landingFeatures: [
      {
        key: "reader-structure",
        title: "问题、贡献与方法拆解",
        desc: "先看论文解决什么，再看它如何做到，最后提炼贡献的边界和前提。",
        to: "/research/paper-reader/ListPage",
        icon: <FileSearchOutlinedIcon />,
        badgeLabel: "Core",
        footerLabel: "结构化理解",
      },
      {
        key: "reader-experiment",
        title: "实验设置与结果复盘",
        desc: "单独整理数据集、指标、基线和 ablation，避免只记住结论忘记条件。",
        to: "/research/paper-reader/ListPage",
        icon: <SlidersOutlinedIcon />,
        badgeLabel: "Experiment",
        footerLabel: "实验层复盘",
      },
      {
        key: "reader-reproduce",
        title: "复现实验与代码清单",
        desc: "把数据、代码、依赖和可能踩坑点拆成可落地的复现清单。",
        to: "/research/paper-reader/ListPage",
        icon: <SearchOutlinedIcon />,
        badgeLabel: "Reproduce",
        footerLabel: "复现准备",
      },
      {
        key: "reader-writing",
        title: "向写作工作台沉淀论据",
        desc: "把贡献摘要、方法对比和实验结论迁移到自己的论文结构中。",
        to: "/research/paper-writing/ListPage",
        icon: <EditOutlinedIcon />,
        badgeLabel: "Writing",
        footerLabel: "论据转写作",
      },
    ],
  }),
  entry({
    key: "research-paper-writing",
    title: "论文写作",
    shortLabel: "论文写作",
    desc: `论文写作与协同工具
• 摘要与提纲
• 章节推进
• 投稿前检查`,
    to: "/research/paper-writing",
    workspaceTo: "/research/paper-writing/ListPage",
    icon: <EditOutlinedIcon />,
    badgeLabel: "Writing",
    footerLabel: "提纲与投稿",
    subLinks: [

    ],
    landingHeadline: "论文写作",
    landingSubtitle: "把提纲、摘要、实验章节和投稿检查串成连续工作流，而不是把写作当成最后才补的一步。",
    landingFeatures: [
      {
        key: "writing-outline",
        title: "提纲与章节推进",
        desc: "管理章节目标、段落骨架和论证顺序，先把结构搭好再写细节。",
        to: "/research/paper-writing/ListPage",
        icon: <EditOutlinedIcon />,
        badgeLabel: "Outline",
        footerLabel: "结构搭建",
      },
      {
        key: "writing-abstract",
        title: "摘要、贡献与图表表达",
        desc: "压缩贡献表述、摘要逻辑和图表说明，让论文更容易被快速理解。",
        to: "/research/paper-writing/ListPage",
        icon: <FileSearchOutlinedIcon />,
        badgeLabel: "Abstract",
        footerLabel: "关键信息表达",
      },
      {
        key: "writing-argument",
        title: "引文论据与相关工作嵌入",
        desc: "把检索和精读得到的论据回填到相关工作、方法设计和讨论部分。",
        to: "/research/paper-reader/ListPage",
        icon: <ReadOutlinedIcon />,
        badgeLabel: "Argument",
        footerLabel: "论据组织",
      },
      {
        key: "writing-submit",
        title: "投稿前检查与版本管理",
        desc: "统一处理格式、匿名化、补充材料和 deadline 之前的终检动作。",
        to: "/research/paper-writing/ListPage",
        icon: <SlidersOutlinedIcon />,
        badgeLabel: "Submit",
        footerLabel: "终检与投稿",
      },
    ],
  }),
];

export const researchHubFeatures: Feature[] = researchModuleCatalog.map((item) => {
  return {
    key: item.key,
    title: item.title,
    desc: item.desc,
    to: item.to,
    icon: item.icon,
    badgeLabel: item.badgeLabel,
    footerLabel: item.footerLabel,
    subLinks: item.subLinks,
  };
});

export const researchHomeSubLinks = researchModuleCatalog.map((item) => ({
  label: item.shortLabel,
  to: item.to,
  icon: item.icon,
}));

export const getResearchModuleCatalogEntry = (key: string) => {
  const matched = researchModuleCatalog.find((item) => item.key === key);
  if (!matched) {
    throw new Error(`Unknown research module catalog key: ${key}`);
  }
  return matched;
};
