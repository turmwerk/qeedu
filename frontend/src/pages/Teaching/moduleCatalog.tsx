import React from "react";
import type { Feature } from "@/feature/ModuleHub";
import {
  BookOutlinedIcon,
  ExperimentOutlinedIcon,
  FormOutlinedIcon,
} from "@/ui/Icon";

type TeachingModuleCatalogEntry = {
  key: string;
  title: string;
  shortLabel: string;
  desc: string;
  to: string;
  icon: React.ReactNode;
};

const entry = (
  value: TeachingModuleCatalogEntry,
): TeachingModuleCatalogEntry => value;

export const teachingModuleCatalog: TeachingModuleCatalogEntry[] = [
  entry({
    key: "teaching-syllabus",
    title: "大纲生成",
    shortLabel: "大纲生成",
    desc: "匹配教学目标、学时结构和考核方式。",
    to: "/teaching/syllabus",
    icon: <BookOutlinedIcon />,
  }),
  entry({
    key: "teaching-exam",
    title: "试卷设计",
    shortLabel: "试卷设计",
    desc: "组织题型结构、题目池和预览导出。",
    to: "/teaching/exam",
    icon: <FormOutlinedIcon />,
  }),
  entry({
    key: "teaching-assignment-review",
    title: "作业批改与反馈",
    shortLabel: "作业批改",
    desc: "批改任务、rubric、反馈草稿和学生订正状态。",
    to: "/teaching/assignment-review",
    icon: <ExperimentOutlinedIcon />,
  }),
];

export const teachingHubFeatures: Feature[] = teachingModuleCatalog.map((item) => ({
  key: item.key,
  title: item.title,
  desc: item.desc,
  to: item.to,
  icon: item.icon,
}));

export const teachingHomeSubLinks = teachingModuleCatalog.map((item) => ({
  label: item.shortLabel,
  to: item.to,
  icon: item.icon,
}));

export const teachingIcon = <ExperimentOutlinedIcon />;
