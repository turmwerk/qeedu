import React from "react";
import ModuleHub from "@/feature/ModuleHub";
import { studyHubFeatures } from "./moduleCatalog";
import { getSearchEntriesByRoutePrefix } from "@/utils/search/global";

const StudyHub: React.FC = () => {
  const features = React.useMemo(
    () =>
      studyHubFeatures.map((item) =>
        item.key === "study-resource-pack"
          ? { ...item, searchIndex: getSearchEntriesByRoutePrefix("/study/resource-pack") }
          : item,
      ),
    [],
  );

  return (
    <ModuleHub
      headline="助学模块围绕资源导航、学业诊断与成长规划展开"
      subtitle="从资源检索、学业诊断到成长规划三个层面组织学习支持，每张卡都给出更明确的切入方向"
      features={features}
      data-oid="study-hub"
    />
  );
};

export default StudyHub;
