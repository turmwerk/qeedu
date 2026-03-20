import React from "react";
import type { Feature } from "@/feature/ModuleHub";
import {
  ControlOutlinedIcon,
  DeploymentUnitOutlinedIcon,
  MailOutlinedIcon,
  NotificationOutlinedIcon,
  SearchOutlinedIcon,
  SlidersOutlinedIcon,
} from "@/ui/Icon";

type ManagementModuleCatalogEntry = {
  key: string;
  title: string;
  shortLabel: string;
  desc: string;
  to: string;
  icon: React.ReactNode;
};

const entry = (
  value: ManagementModuleCatalogEntry,
): ManagementModuleCatalogEntry => value;

export const managementModuleCatalog: ManagementModuleCatalogEntry[] = [
  entry({
    key: "management-process-assistant",
    title: "事务处理助手",
    shortLabel: "事务处理",
    desc: "审批流程、材料清单和办理步骤自动整理。",
    to: "/management/process-assistant",
    icon: <DeploymentUnitOutlinedIcon />,
  }),
  entry({
    key: "management-announcement-generator",
    title: "通知与公告生成",
    shortLabel: "通知公告",
    desc: "结构化输入、多渠道生成和继续对话润色。",
    to: "/management/announcement-generator",
    icon: <NotificationOutlinedIcon />,
  }),
  entry({
    key: "management-materials-center",
    title: "材料与表单管理",
    shortLabel: "材料表单",
    desc: "统一管理提交材料、状态追踪和模板归档。",
    to: "/management/materials-center",
    icon: <MailOutlinedIcon />,
  }),
  entry({
    key: "management-student-qa",
    title: "学生问答助手",
    shortLabel: "学生问答",
    desc: "高频问题回复、知识沉淀和答疑入口。",
    to: "/management/student-qa",
    icon: <SearchOutlinedIcon />,
  }),
  entry({
    key: "management-dashboard",
    title: "数据统计与看板",
    shortLabel: "数据看板",
    desc: "申请人数、完成率和进度分布可视化。",
    to: "/management/dashboard",
    icon: <SlidersOutlinedIcon />,
  }),
  entry({
    key: "management-timeline",
    title: "时间节点管理",
    shortLabel: "时间节点",
    desc: "DDL、面试与补件提醒统一编排。",
    to: "/management/timeline",
    icon: <ControlOutlinedIcon />,
  }),
];

export const managementHubFeatures: Feature[] = managementModuleCatalog.map((item) => ({
  key: item.key,
  title: item.title,
  desc: item.desc,
  to: item.to,
  icon: item.icon,
}));

export const managementHomeSubLinks = managementModuleCatalog.map((item) => ({
  label: item.shortLabel,
  to: item.to,
  icon: item.icon,
}));

export const managementIcon = <ControlOutlinedIcon />;
