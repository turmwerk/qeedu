import React from "react";
import type { Feature } from "@/feature/ModuleHub";
import {
  BookOutlinedIcon,
  ReadOutlinedIcon,
  SlidersOutlinedIcon,
  TeamOutlinedIcon,
} from "@/ui/Icon";

type StudyModuleCatalogEntry = {
  key: string;
  title: string;
  shortLabel: string;
  desc: string;
  details: string[];
  to: string;
  icon: React.ReactNode;
};

const entry = (
  value: StudyModuleCatalogEntry,
): StudyModuleCatalogEntry => value;

export const studyModuleCatalog: StudyModuleCatalogEntry[] = [
  entry({
    key: "study-resource-pack",
    title: "学科资源包",
    shortLabel: "资源包",
    desc: "从学院、学科门类和招生专业类三条入口组织资源，再继续下钻到具体专业和学院详情。",
    details: ["学院入口", "学科地图", "招生分类", "专业详情"],
    to: "/study/resource-pack",
    icon: <BookOutlinedIcon />,
  }),
  entry({
    key: "study-progress-radar",
    title: "学业进度雷达",
    shortLabel: "进度雷达",
    desc: "围绕培养方案匹配、学分完成情况、风险课程和毕业偏离做持续诊断，适合阶段性复盘。",
    details: ["培养方案", "学分进度", "风险课程", "毕业偏离"],
    to: "/study/progress-radar",
    icon: <SlidersOutlinedIcon />,
  }),
  entry({
    key: "study-career-planner",
    title: "智能生涯规划",
    shortLabel: "生涯规划",
    desc: "通过对话梳理目标画像、大学阶段成长路径和关键节点，把想法逐步转成可执行计划。",
    details: ["目标画像", "路径拆解", "节点提醒", "对话共创"],
    to: "/study/career-planner",
    icon: <TeamOutlinedIcon />,
  }),
];

export const studyHubFeatures: Feature[] = studyModuleCatalog.map((item) => ({
  key: item.key,
  title: item.title,
  desc: item.desc,
  details: item.details,
  to: item.to,
  icon: item.icon,
}));

export const studyHomeSubLinks = studyModuleCatalog.map((item) => ({
  label: item.shortLabel,
  to: item.to,
  icon: item.icon,
}));

export const studyIcon = <ReadOutlinedIcon />;
