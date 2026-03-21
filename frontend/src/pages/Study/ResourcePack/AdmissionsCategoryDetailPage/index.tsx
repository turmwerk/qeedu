import React from "react";
import { useParams } from "react-router-dom";
import {
  ShowcasePanel,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import {
  findDisciplinesByAdmissionsCategory,
  findSchoolsByAdmissionsCategory,
  getAdmissionsCategoryBySlug,
} from "../../resourceCatalog";
import RelatedLinksPanel from "../RelatedLinksPanel";

const AdmissionsCategoryDetailPage: React.FC = () => {
  const { categorySlug } = useParams();
  const category = getAdmissionsCategoryBySlug(categorySlug);

  if (!category) {
    return (
      <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
        <ShowcasePanel title="未找到招生专业类" description="请返回招生专业分类页重新选择。">
          <div className={`${showcasePanelClass} p-5 text-[15px] leading-8 text-[#67748a] dark:text-[#dbe5f3]`}>
            当前招生专业类 slug 不存在或尚未登记到资源目录中。
          </div>
        </ShowcasePanel>
      </div>
    );
  }

  const relatedSchools = findSchoolsByAdmissionsCategory(category);
  const relatedDisciplines = findDisciplinesByAdmissionsCategory(category);

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className={`${showcasePanelClass} p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Admissions Category</div>
            <div className="mt-2 text-[34px] font-black leading-tight text-[#243246] dark:text-white">
              {category.title}
            </div>
            <div className="mt-3 text-[16px] leading-8 text-[#67748a] dark:text-[#dbe5f3]">
              {category.duration} 年制，共保留 {category.tracks.length} 条分流专业或培养方向数据。适合先确认分流去向，再回到学院页和学科页做交叉对照。
            </div>
          </div>
          <ShowcaseTag tone="orange">路由与数据已保留</ShowcaseTag>
        </div>
      </section>

      <ShowcasePanel
        eyebrow="Tracks"
        title="分流专业与培养院系"
        description="当前页先承担完整数据展示，后续再往下挂接专业资源与学院页。"
      >
        <div className="grid gap-4">
          {category.tracks.map((track) => (
            <div key={`${category.key}-${track.title}`} className={`${showcasePanelClass} p-5`}>
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-[18px] font-black text-[#243246] dark:text-white">{track.title}</div>
                {track.isFirstClass ? <ShowcaseTag tone="green">国家级一流本科专业建设点</ShowcaseTag> : null}
              </div>
              <div className="mt-3 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">
                培养院系：{track.schools.join("、")}
              </div>
            </div>
          ))}
        </div>
      </ShowcasePanel>

      <RelatedLinksPanel
        title="继续浏览"
        description="把当前招生专业类和上级目录、对应学院、相关学科连起来，方便沿着分流方向继续查。"
        groups={[
          {
            title: "上级入口",
            description: "回到招生专业分类总览，或切换到学院与学科入口继续横向比较。",
            links: [
              { label: "招生专业分类总览", to: "/study/resource-pack/admissions-categories" },
              { label: "学院分类总览", to: "/study/resource-pack/nju-schools" },
              { label: "学科大类总览", to: "/study/resource-pack/disciplines" },
            ],
          },
          {
            title: "对应学院",
            description: "这些学院承接当前招生专业类中的培养方向，可以直接继续查看学院入口页。",
            links: relatedSchools.map((school) => ({
              label: school.title,
              to: `/study/resource-pack/nju-schools/${school.slug}`,
            })),
          },
          {
            title: "相关学科",
            description: "这些学科门类能覆盖当前招生类中的主要专业方向，适合继续下钻到具体专业。",
            links: relatedDisciplines.map((discipline) => ({
              label: discipline.title,
              to: `/study/resource-pack/disciplines/${discipline.slug}`,
            })),
          },
        ]}
      />
    </div>
  );
};

export default AdmissionsCategoryDetailPage;
