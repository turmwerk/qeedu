import React from "react";
import ModuleHub from "@/feature/ModuleHub";
import { managementHubFeatures } from "./moduleCatalog";

const ManagementHub: React.FC = () => {
  return (
    <ModuleHub
      headline="助管模块覆盖事务推进、通知生成、材料管理与节点统筹"
      subtitle="事务处理 · 通知公告 · 材料表单 · 学生问答 · 数据看板 · 时间节点"
      features={managementHubFeatures}
      gridCols="grid-cols-2 xl:grid-cols-3"
      data-oid="management-hub"
    />
  );
};

export default ManagementHub;
