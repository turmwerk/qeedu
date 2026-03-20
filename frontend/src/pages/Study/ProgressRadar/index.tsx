import React from "react";
import {
  ShowcasePanel,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";

const ProgressRadar: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className="rounded-[32px] bg-[linear-gradient(135deg,#5a6bff,#7f8bff,#9fb2ff)] p-6 text-white shadow-[0_24px_60px_rgba(90,107,255,0.26)]">
        <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-white/72">Progress Radar</div>
        <div className="mt-2 text-[34px] font-black leading-tight md:text-[52px]">学业进度雷达</div>
        <div className="mt-4 max-w-3xl text-[16px] leading-8 text-white/86">
          以培养方案匹配、风险课程、毕业路径偏离和行动建议为核心，帮助学生把“我现在学得怎么样”变成可追踪的结构化判断。
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          ["培养方案完成度", "76%", "主干课程整体推进稳定"],
          ["风险课程", "2 门", "高等数学、数据结构需要重点跟进"],
          ["毕业路径偏离", "低", "当前未出现关键节点错位"],
          ["实践学分覆盖", "68%", "还差 1 次竞赛/项目型成果"],
          ["AI 建议优先级", "高", "建议先修正本学期课程压力分布"],
        ].map(([label, value, detail]) => (
          <div key={label} className={`${showcasePanelClass} p-5`}>
            <div className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">{label}</div>
            <div className="mt-3 text-[32px] font-black text-[#243246] dark:text-white">{value}</div>
            <div className="mt-2 text-[14px] leading-6 text-[#67748a] dark:text-[#dbe5f3]">{detail}</div>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
        <ShowcasePanel
          eyebrow="Core Signals"
          title="本学期学业信号"
          description="把课程、培养方案和节奏问题拆成可解释的面板。"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["风险课程", "数据结构作业延期 2 次，高数阶段测验波动明显。"],
              ["培养方案匹配", "专业核心课进度正常，但通识课程仍缺 2 学分。"],
              ["毕业路径偏离", "若下学期不补实践模块，会影响综合能力学分完成。"],
              ["学习负载", "课程负载集中在周中，建议把编程任务前置到周末。"],
            ].map(([title, desc]) => (
              <div key={title} className={`${showcasePanelClass} p-5`}>
                <div className="text-[18px] font-black text-[#243246] dark:text-white">{title}</div>
                <div className="mt-3 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{desc}</div>
              </div>
            ))}
          </div>
        </ShowcasePanel>

        <ShowcasePanel
          eyebrow="Action Plan"
          title="AI 行动建议"
          description="先做少数高影响动作，避免在低优先级任务上消耗精力。"
        >
          <div className="space-y-4">
            {[
              ["本周", "补齐数据结构实验，预约助教答疑，完成高数错题回看。"],
              ["本月", "核查培养方案缺口，补记 1 次科研训练或竞赛规划。"],
              ["下学期前", "确定专业方向课优先级，避免与毕业关键课撞车。"],
            ].map(([time, desc], index) => (
              <div key={time} className={`${showcasePanelClass} p-5`}>
                <div className="flex items-center gap-3">
                  <ShowcaseTag tone={index === 0 ? "red" : index === 1 ? "orange" : "blue"}>{time}</ShowcaseTag>
                </div>
                <div className="mt-3 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{desc}</div>
              </div>
            ))}
          </div>
        </ShowcasePanel>
      </div>
    </div>
  );
};

export default ProgressRadar;
