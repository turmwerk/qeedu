import React from "react";
import ModuleHub from "@/feature/ModuleHub";
import { teachingHubFeatures } from "./moduleCatalog";

const TeachingHub: React.FC = () => {
  return (
    <ModuleHub
      headline="助教模块帮助教师组织课程设计、试卷生成与作业反馈"
      subtitle="大纲生成 · 试卷设计 · 作业批改与反馈"
      features={teachingHubFeatures}
      data-oid="teaching-hub"
    />
  );
};

export default TeachingHub;
