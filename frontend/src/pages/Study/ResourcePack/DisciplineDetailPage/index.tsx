import React from "react";
import { useParams } from "react-router-dom";
import ModuleHub from "@/feature/ModuleHub";
import {
  ShowcasePanel,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import { getDisciplineBySlug } from "../../resourceCatalog";
import { ReadOutlinedIcon } from "@/ui/Icon";

const DisciplineDetailPage: React.FC = () => {
  const { disciplineSlug } = useParams();
  const discipline = getDisciplineBySlug(disciplineSlug);

  if (!discipline) {
    return (
      <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
        <ShowcasePanel title="未找到学科门类" description="请返回学科资源包重新选择。">
          <div className={`${showcasePanelClass} p-5 text-[15px] leading-8 text-[#67748a] dark:text-[#dbe5f3]`}>
            当前学科 slug 不存在，可能是链接已变更。
          </div>
        </ShowcasePanel>
      </div>
    );
  }

  return (
    <ModuleHub
      headline={discipline.title}
      subtitle={discipline.desc}
      features={discipline.majors.map((major) => ({
        key: major.key,
        title: major.title,
        desc: major.desc,
        to: `/study/resource-pack/disciplines/${discipline.slug}/${major.slug}`,
        icon: <ReadOutlinedIcon />,
        subLinks: major.relatedLinks,
      }))}
      gridCols="grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
      data-oid="discipline-detail-page"
    />
  );
};

export default DisciplineDetailPage;
