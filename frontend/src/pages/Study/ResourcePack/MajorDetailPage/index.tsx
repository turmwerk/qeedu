import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ShowcasePanel,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";
import { getMajorByDisciplineAndSlug } from "../../resourceCatalog";
import Button from "@/ui/Button";

const MajorDetailPage: React.FC = () => {
  const navigate = useNavigate();
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

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className={`${showcasePanelClass} p-6`}>
        <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Major Resource Pack</div>
        <div className="mt-2 text-[34px] font-black leading-tight text-[#243246] dark:text-white">
          {major.title}
        </div>
        <div className="mt-3 text-[16px] leading-8 text-[#67748a] dark:text-[#dbe5f3]">
          所属学科：{discipline.title}。{major.desc}
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

      {major.relatedLinks?.length ? (
        <ShowcasePanel
          eyebrow="Related Entry"
          title="已接通的现有能力"
          description="部分信息类专业优先复用现有编程辅导与代码项目工作台。"
        >
          <div className="flex flex-wrap gap-3">
            {major.relatedLinks.map((link) => (
              <Button
                key={link.label}
                className="rounded-2xl border border-[#dbe1f3] bg-white px-5 py-3 text-sm font-semibold text-[#334155] dark:border-white/10 dark:bg-white/8 dark:text-white"
                onClick={() => {
                  if (link.to) navigate(link.to);
                }}
              >
                {link.label}
              </Button>
            ))}
          </div>
        </ShowcasePanel>
      ) : null}
    </div>
  );
};

export default MajorDetailPage;
