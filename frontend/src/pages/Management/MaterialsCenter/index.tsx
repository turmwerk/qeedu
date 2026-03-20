import React from "react";
import { ShowcasePanel, showcasePanelClass } from "@/feature/ScenarioShowcase";

const MaterialsCenter: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <ShowcasePanel
        eyebrow="Materials Center"
        title="材料与表单管理"
        description="统一收集提交材料、模板、补件记录和审核状态，减少资料散落。"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["模板归档", "按业务类型管理表单模板、附件要求和示例。"],
            ["状态追踪", "区分未提交、待补件、待审核、已完成。"],
            ["批量导出", "后续支持一键导出名单、状态表和缺件清单。"],
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

export default MaterialsCenter;
