import React from "react";
import { ShowcaseTag, showcasePanelClass } from "@/feature/ScenarioShowcase";

const ProcessAssistant: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className={`${showcasePanelClass} p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Management Process</div>
            <div className="mt-2 text-[34px] font-black text-[#243246] dark:text-white">事务处理助手</div>
            <div className="mt-3 max-w-3xl text-[16px] leading-8 text-[#67748a] dark:text-[#dbe5f3]">
              把审批步骤、材料清单、责任人和节点节奏放在统一流程面板里，帮助辅导员、教务老师和项目秘书减少反复沟通。
            </div>
          </div>
          <ShowcaseTag tone="blue">正式 landing 页</ShowcaseTag>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["流程拆解", "把请假、补件、申报、审批等事务拆成角色化步骤。"],
          ["材料清单", "统一说明必交、选交、模板和审核口径。"],
          ["异常处理", "把缺件、逾期、格式不符等问题改写成补救动作。"],
        ].map(([title, desc]) => (
          <div key={title} className={`${showcasePanelClass} p-5`}>
            <div className="text-[18px] font-black text-[#243246] dark:text-white">{title}</div>
            <div className="mt-3 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessAssistant;
