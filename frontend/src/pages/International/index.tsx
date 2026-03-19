import React from "react";
import ModuleHub from "@/feature/ModuleHub";
import { internationalHubFeatures } from "./moduleCatalog";

const InternationalHub: React.FC = () => {
  return (
    <ModuleHub
      headline="国际交流模块覆盖交换申请、派出支持、在外期间与返校沉淀全流程"
      subtitle="项目中心 · 智能匹配 · 流程推进 · 沟通协作 · 行前行后支持"
      features={internationalHubFeatures}
      gridCols="grid-cols-2 lg:grid-cols-3"
    />
  );
};

export default InternationalHub;
