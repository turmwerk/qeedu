import React from "react";
import ModuleHub from "@/feature/ModuleHub";
import { researchHubFeatures } from "./moduleCatalog";

const ResearchHub: React.FC = () => {
  return (
    <ModuleHub
      headline="助研模块可以帮你更高效推进文献发现、精读比较与论文写作"
      subtitle="文献检索 · 论文精读 · 写作协同"
      features={researchHubFeatures}
    />
  );
};

export default ResearchHub;
