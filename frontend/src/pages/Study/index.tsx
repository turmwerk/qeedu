import React from "react";
import ModuleHub from "@/feature/ModuleHub";
import { studyHubFeatures } from "./moduleCatalog";

const StudyHub: React.FC = () => {
  return (
    <ModuleHub
      headline="助学模块围绕资源导航、学业诊断与成长规划展开"
      subtitle="学科资源包 · 学业进度雷达 · 智能生涯规划"
      features={studyHubFeatures}
      data-oid="study-hub"
    />
  );
};

export default StudyHub;
