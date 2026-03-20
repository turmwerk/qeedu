import React from "react";
import { ShowcasePanel, showcasePanelClass } from "@/feature/ScenarioShowcase";

const Dashboard: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <ShowcasePanel eyebrow="Dashboard" title="数据统计与看板" description="从完成率、逾期率和业务负载看管理状态。">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["本周待办", "18", "含材料审核、公告发布与审批跟进"],
            ["按时完成率", "91%", "较上周提升 5%"],
            ["逾期任务", "3", "集中在补件环节"],
            ["学生咨询量", "46", "FAQ 覆盖后可继续下降"],
          ].map(([label, value, desc]) => (
            <div key={label} className={`${showcasePanelClass} p-5`}>
              <div className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">{label}</div>
              <div className="mt-3 text-[32px] font-black text-[#243246] dark:text-white">{value}</div>
              <div className="mt-2 text-[14px] leading-6 text-[#67748a] dark:text-[#dbe5f3]">{desc}</div>
            </div>
          ))}
        </div>
      </ShowcasePanel>
    </div>
  );
};

export default Dashboard;
