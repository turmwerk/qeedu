import React from "react";
import { ShowcasePanel, ShowcaseTag, showcasePanelClass } from "@/feature/ScenarioShowcase";

const Timeline: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <ShowcasePanel
        eyebrow="Timeline"
        title="时间节点管理"
        description="统一展示报名、补件、审批、面试和发布的时间节奏。"
      >
        <div className="space-y-4">
          {[
            ["03/25", "交换项目院内宣讲", "待开始", "blue"],
            ["03/28", "本科竞赛报名截止", "高优先级", "orange"],
            ["04/02", "奖学金补件终止", "风险节点", "red"],
            ["04/08", "中期考核材料汇总", "进行中", "green"],
          ].map(([date, title, status, tone]) => (
            <div key={`${date}-${title}`} className={`${showcasePanelClass} flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between`}>
              <div>
                <div className="text-[18px] font-black text-[#243246] dark:text-white">{title}</div>
                <div className="mt-2 text-[14px] text-[#67748a] dark:text-[#dbe5f3]">节点日期：{date}</div>
              </div>
              <ShowcaseTag tone={tone as "blue" | "green" | "orange" | "red"}>{status}</ShowcaseTag>
            </div>
          ))}
        </div>
      </ShowcasePanel>
    </div>
  );
};

export default Timeline;
