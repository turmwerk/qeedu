import React from "react";
import ModuleHub from "@/feature/ModuleHub";
import { njuSchoolCatalog } from "../../resourceCatalog";
import { BankOutlinedIcon } from "@/ui/Icon";

const NJUSchoolsPage: React.FC = () => {
  return (
    <ModuleHub
      headline="按南京大学学院分类"
      subtitle="本轮先保留学院入口与独立路由，后续逐步补齐学院页内容"
      features={njuSchoolCatalog.map((school) => ({
        key: school.key,
        title: school.title,
        desc: school.desc,
        to: `/study/resource-pack/nju-schools/${school.slug}`,
        icon: <BankOutlinedIcon />,
      }))}
      gridCols="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
      data-oid="nju-schools-page"
    />
  );
};

export default NJUSchoolsPage;
