import React from "react";
import OverviewMetrics from "@/feature/RecordWorkspace/OverviewMetrics";
import { ModuleCard } from "@/feature/ModuleHub";
import { RecordList, ShowcasePanel, showcasePanelClass } from "@/feature/ScenarioShowcase";
import { conferenceCountdownMetrics } from "./ConferenceList/data";
import { researchHubFeatures, researchModuleCatalog } from "./moduleCatalog";

const ResearchHub: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-8 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[28px] border border-[#dbe1f3] bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-[24px] dark:border-white/10 dark:bg-white/8">
        <OverviewMetrics metrics={conferenceCountdownMetrics} />
      </section>

      <div className="module-hub-grid grid gap-x-2 gap-y-2 sm:gap-x-8 sm:gap-y-8 relative z-[1] min-w-0 grid-cols-2 lg:grid-cols-3">
        {researchHubFeatures.map((item) => (
          <ModuleCard
            key={item.key}
            title={item.title}
            desc={item.desc}
            to={item.to as string}
            icon={item.icon}
            subLinks={item.subLinks}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <RecordList
          eyebrow="Recent Tasks"
          title="最近进行中的任务"
          description="把正在推进的检索、精读和写作任务放在一处，避免研究链路断开。"
          actionLabel="进入工作台"
          records={[
            {
              title: "RAG 评测综述检索",
              meta: "文献检索 · 目标样本 40 篇",
              summary: "当前处于初筛阶段，待把高价值样本移交到精读工作台。",
              status: "初筛中",
              tags: ["检索式", "样本池", "本周重点"],
              actions: [{ label: "打开检索工作台", primary: true }],
            },
            {
              title: "CHI 2025 交互式智能体论文精读",
              meta: "论文精读 · 复现实验准备",
              summary: "已提炼贡献和实验设计，下一步补复现实验清单。",
              status: "精读中",
              tags: ["贡献提炼", "实验复盘"],
              actions: [{ label: "继续精读", primary: true }],
            },
            {
              title: "论文摘要与 Related Work 重写",
              meta: "论文写作 · 投稿前版本整理",
              summary: "需要把文献检索与精读结果重新组织成更紧凑的论据链。",
              status: "写作中",
              tags: ["摘要", "相关工作", "投稿准备"],
              actions: [{ label: "进入写作工作台", primary: true }],
            },
          ]}
        />

        <ShowcasePanel
          eyebrow="Quick Access"
          title="快捷入口"
          description="正式 landing page 负责说明场景，工作台继续承接记录与详情。"
        >
          <div className="grid gap-4">
            {researchModuleCatalog.map((module) => (
              <div key={module.key} className={`${showcasePanelClass} p-5`}>
                <div className="text-[18px] font-black text-[#243246] dark:text-white">{module.title}</div>
                <div className="mt-3 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3] whitespace-pre-line">
                  {module.desc}
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-[14px] font-semibold text-[#5672ff]">
                  <span>正式页：{module.to}</span>
                  {module.workspaceTo ? <span>工作台：{module.workspaceTo}</span> : null}
                </div>
              </div>
            ))}
          </div>
        </ShowcasePanel>
      </div>
    </div>
  );
};

export default ResearchHub;
