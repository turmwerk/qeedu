import React from "react";
import ModuleHub from "@/pages/shared/ModuleHub";
import {
  ReadOutlined,
  ExperimentOutlined,
  ControlOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const modules = [
  {
    key: "study",
    title: "助学",
    desc: "自学导航、练习计划、随问随答。",
    to: "/study",
    icon: <ReadOutlined data-oid="r9i6-at" />,
  },
  {
    key: "teaching",
    title: "助教",
    desc: "试卷生成、大纲设计、作业批改与反馈。",
    to: "/teaching",
    icon: <ExperimentOutlined data-oid="4hschjv" />,
  },
  {
    key: "research",
    title: "助研",
    desc: "科研协作、资料整理、进度跟踪。",
    to: "/research",
    icon: <TeamOutlined data-oid="ga65l.j" />,
  },
  {
    key: "management",
    title: "助管",
    desc: "班级管理、通知发布、资料归档与跟进。",
    to: "/management",
    icon: <ControlOutlined data-oid="5f1:ofq" />,
  },
];

const FeatureHub: React.FC = () => {
  return (
    <ModuleHub
      headline="nju-edu-ai-system"
      subtitle="南京大学教育大模型"
      features={modules}
    />
  );
};

export default FeatureHub;
