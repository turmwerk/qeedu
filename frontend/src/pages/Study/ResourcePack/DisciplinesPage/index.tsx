import React from "react";
import ModuleHub from "@/feature/ModuleHub";
import { disciplineCatalog } from "../../resourceCatalog";
import { BookOutlinedIcon } from "@/ui/Icon";

const DisciplinesPage: React.FC = () => {
  return (
    <ModuleHub
      headline="按学科大类专业分类"
      subtitle="覆盖 sample 中全部学科门类与专业子路由"
      features={disciplineCatalog.map((discipline) => ({
        key: discipline.key,
        title: discipline.title,
        desc: `${discipline.desc} 共 ${discipline.majors.length} 个专业入口。`,
        to: `/study/resource-pack/disciplines/${discipline.slug}`,
        icon: <BookOutlinedIcon />,
      }))}
      gridCols="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
      data-oid="discipline-page"
    />
  );
};

export default DisciplinesPage;
