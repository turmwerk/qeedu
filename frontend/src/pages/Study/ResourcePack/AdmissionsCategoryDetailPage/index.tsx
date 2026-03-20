import React from "react";
import { useParams } from "react-router-dom";
import {
  ShowcasePanel,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import { getAdmissionsCategoryBySlug } from "../../resourceCatalog";

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
              {category.duration} 年制，共保留 {category.tracks.length} 条分流专业或培养方向数据。
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
    </div>
  );
};

export default AdmissionsCategoryDetailPage;
