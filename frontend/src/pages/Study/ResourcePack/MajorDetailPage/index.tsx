import React from "react";
import { useParams } from "react-router-dom";
import {
  ShowcasePanel,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import {
  findAdmissionsCategoriesByMajorTitle,
  findSchoolsByMajorTitle,
  getMajorByDisciplineAndSlug,
} from "../../resourceCatalog";
import RelatedLinksPanel from "../RelatedLinksPanel";

const MajorDetailPage: React.FC = () => {
  const { disciplineSlug, majorSlug } = useParams();
  const matched = getMajorByDisciplineAndSlug(disciplineSlug, majorSlug);

  if (!matched) {
    return (
      <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
        <ShowcasePanel title="未找到专业资源页" description="请返回学科页重新选择专业。">
          <div className={`${showcasePanelClass} p-5 text-[15px] leading-8 text-[#67748a] dark:text-[#dbe5f3]`}>
            当前专业 slug 不存在或尚未纳入资源目录。
          </div>
        </ShowcasePanel>
      </div>
    );
  }

  const { discipline, major } = matched;
  const relatedAdmissionsCategories = findAdmissionsCategoriesByMajorTitle(
    major.title,
  ).slice(0, 6);
  const relatedSchools = findSchoolsByMajorTitle(major.title).slice(0, 6);

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className={`${showcasePanelClass} p-6`}>
        <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Major Resource Pack</div>
        <div className="mt-2 text-[34px] font-black leading-tight text-[#243246] dark:text-white">
          {major.title}
        </div>
        <div className="mt-3 text-[16px] leading-8 text-[#67748a] dark:text-[#dbe5f3]">
          所属学科：{discipline.title}。{major.desc} 可以先结合下方的资源组织结构建立学习路径，再沿着相关链接切到招生类、学院页或已接通能力。
        </div>
        {major.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {major.tags.map((tag) => (
              <ShowcaseTag key={tag}>{tag}</ShowcaseTag>
            ))}
          </div>
        ) : null}
      </section>

      <ShowcasePanel
        eyebrow="Resource Axes"
        title="资源组织结构"
        description="本轮先建立专业级资源包路由，后续逐步接入课程、资料、问答与典型路径。"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["课程地图", "按基础课、进阶课、选修课组织课程和学习路径。"],
            ["资料入口", "沉淀课程主页、书单、开源资源、竞赛和实验平台。"],
            ["典型问题", "收敛本专业高频难点、常见误区和 AI 答疑入口。"],
          ].map(([title, desc]) => (
            <div key={title} className={`${showcasePanelClass} p-5`}>
              <div className="text-[18px] font-black text-[#243246] dark:text-white">{title}</div>
              <div className="mt-3 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{desc}</div>
            </div>
          ))}
        </div>
      </ShowcasePanel>

      <RelatedLinksPanel
        title="继续浏览"
        description="把当前专业页和上级目录、关联招生类、相关学院以及已接通能力串起来，方便继续下钻。"
        gridCols="md:grid-cols-2 xl:grid-cols-4"
        groups={[
          {
            title: "上级入口",
            description: "从专业页返回到学科页、学科总览或资源包首页，快速切换浏览维度。",
            links: [
              {
                label: `返回${discipline.title}`,
                to: `/study/resource-pack/disciplines/${discipline.slug}`,
              },
              { label: "学科大类总览", to: "/study/resource-pack/disciplines" },
              { label: "资源包首页", to: "/study/resource-pack" },
            ],
          },
          {
            title: "关联招生类",
            description: "这些招生专业类会流向当前专业或其同名培养方向，适合继续查看分流与培养院系。",
            links: relatedAdmissionsCategories.map((category) => ({
              label: category.title,
              to: `/study/resource-pack/admissions-categories/${category.slug}`,
            })),
          },
          {
            title: "相关学院",
            description: "这些学院与当前专业存在招生或培养关联，可以继续回到学院视角查看资源布局。",
            links: relatedSchools.map((school) => ({
              label: school.title,
              to: `/study/resource-pack/nju-schools/${school.slug}`,
            })),
          },
          {
            title: "已接通能力",
            description: "部分专业已经挂上现有学习工具或工作台，可以直接继续使用。",
            links: major.relatedLinks ?? [],
          },
        ]}
      />
    </div>
  );
};

export default MajorDetailPage;
