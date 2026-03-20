import React from "react";
import { useParams } from "react-router-dom";
import {
  ShowcasePanel,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import { getSchoolBySlug } from "../../resourceCatalog";

const NJUSchoolDetailPage: React.FC = () => {
  const { schoolSlug } = useParams();
  const school = getSchoolBySlug(schoolSlug);

  if (!school) {
    return (
      <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
        <ShowcasePanel title="未找到学院入口" description="请返回学院分类页重新选择。">
          <div className={`${showcasePanelClass} p-5 text-[15px] leading-8 text-[#67748a] dark:text-[#dbe5f3]`}>
            当前学院 slug 不存在，后续可以在资源目录数据里继续扩展。
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
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">NJU School</div>
            <div className="mt-2 text-[34px] font-black leading-tight text-[#243246] dark:text-white">
              {school.title}
            </div>
            <div className="mt-3 max-w-3xl text-[16px] leading-8 text-[#67748a] dark:text-[#dbe5f3]">
              {school.desc}
            </div>
          </div>
          <ShowcaseTag tone="orange">规划中</ShowcaseTag>
        </div>
      </section>

      <ShowcasePanel
        eyebrow="Planned Structure"
        title="后续接入内容"
        description="这一层先把学院入口固定下来，后面再把专业、资源与培养路径逐步挂接到学院页。"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["学院专业清单", "补齐学院下的本科专业、方向分流和典型学习路径。"],
            ["资源入口聚合", "挂接课程站点、竞赛资源、培养方案和典型问答。"],
            ["学院特色导航", "沉淀学院特色课程、跨学科机会和就业深造建议。"],
          ].map(([title, desc]) => (
            <div key={title} className={`${showcasePanelClass} p-5`}>
              <div className="text-[18px] font-black text-[#243246] dark:text-white">{title}</div>
              <div className="mt-3 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{desc}</div>
            </div>
          ))}
        </div>
      </ShowcasePanel>
    </div>
  );
};

export default NJUSchoolDetailPage;
