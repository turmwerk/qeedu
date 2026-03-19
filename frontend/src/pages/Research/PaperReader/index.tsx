import React from "react";
import Button from "@/ui/Button";
import { ShowcaseTag, showcasePanelClass } from "@/feature/ScenarioShowcase";

const PaperReader: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="text-[34px] font-black leading-tight text-[#243246] md:text-[64px] dark:text-white">
        智能文献阅读器
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_340px]">
          <div className="space-y-4">
            <div className={`${showcasePanelClass} p-5`}>
              <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Paper Queue</div>
              <div className="mt-2 text-[22px] font-black text-[#243246] dark:text-white">当前精读论文</div>
              <div className="mt-4 space-y-3">
                {[
                  "Anchoring Effects in AI-Assisted Sketch Ideation",
                  "Timing Matters: Intervention Schedules for Human-AI Co-Creation",
                  "Flow and Friction in Prompt-Driven Design Workflows",
                ].map((item, index) => (
                  <div key={item} className="rounded-[20px] border border-[#dbe1f3] bg-white/76 px-4 py-4 text-[15px] font-medium text-[#475569] dark:border-white/10 dark:bg-white/6 dark:text-[#dbe5f3]">
                    {index === 0 ? <span className="mr-2 font-bold text-[#5672ff]">当前</span> : null}
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className={`${showcasePanelClass} p-5`}>
              <div className="text-[22px] font-black text-[#243246] dark:text-white">阅读模式</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <ShowcaseTag>单篇精读</ShowcaseTag>
                <ShowcaseTag tone="gray">多篇比较</ShowcaseTag>
                <ShowcaseTag tone="gray">复现实验</ShowcaseTag>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className={`${showcasePanelClass} p-5`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Selected Paper</div>
                  <div className="mt-2 text-[28px] font-black text-[#243246] dark:text-white">
                    Anchoring Effects in AI-Assisted Sketch Ideation
                  </div>
                  <div className="mt-2 text-[16px] leading-8 text-[#67748a] dark:text-[#dbe5f3]">
                    Wu, Santos, Meyer · UIST 2024 · 围绕 AI 介入时机与创意锚定效应展开研究。
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="rounded-[18px] border border-[#dbe1f3] bg-white px-4 py-2 text-sm font-semibold text-[#334155]">PDF</Button>
                  <Button className="rounded-[18px] border border-[#dbe1f3] bg-white px-4 py-2 text-sm font-semibold text-[#334155]">Compare</Button>
                </div>
              </div>
            </div>
            <div className={`${showcasePanelClass} p-5`}>
              <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Structured Reading Notes</div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {[
                  ["Research Question", "AI intervention 在 sketch ideation 的什么阶段最容易产生锚定与流动性损失？"],
                  ["Method", "比较不同介入时机与提示强度对创意发散与聚焦的影响。"],
                  ["Dataset / Task", "控制式创意草图任务，记录用户在不同 prompt 介入阶段的表现。"],
                  ["Evaluation", "创意多样性、完成质量、主观 autonomy、flow disruption 等指标。"],
                  ["Limitations", "样本量偏小，任务类型较集中，对长期真实工作流外推有限。"],
                  ["Future Work", "比较不同学科、不同提示形式以及 collaborative setting 下的时机差异。"],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-[22px] border border-[#dbe1f3] bg-white/76 p-4 dark:border-white/10 dark:bg-white/6">
                    <div className="text-[16px] font-black text-[#243246] dark:text-white">{title}</div>
                    <div className="mt-2 text-[14px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`${showcasePanelClass} p-5`}>
              <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Evidence</div>
              <div className="mt-2 text-[22px] font-black text-[#243246] dark:text-white">原文证据位置</div>
              <div className="mt-4 space-y-3">
                {[
                  "Section 1.2：定义 intervention timing 和 workflow disruption",
                  "Figure 3：展示不同介入时机下创意结果差异",
                  "Section 5：limitations 与实际工作流边界",
                ].map((item) => (
                  <div key={item} className="rounded-[20px] border border-[#dbe1f3] bg-white/76 px-4 py-4 text-[15px] text-[#475569] dark:border-white/10 dark:bg-white/6 dark:text-[#dbe5f3]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className={`${showcasePanelClass} p-5`}>
              <div className="text-[22px] font-black text-[#243246] dark:text-white">Compare Queue</div>
              <div className="mt-3 space-y-3">
                {[
                  "Timing Matters: Intervention Schedules for Human-AI Co-Creation",
                  "Flow and Friction in Prompt-Driven Design Workflows",
                ].map((item) => (
                  <div key={item} className="rounded-[20px] border border-[#dbe1f3] bg-white/76 px-4 py-4 text-[15px] text-[#475569] dark:border-white/10 dark:bg-white/6 dark:text-[#dbe5f3]">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-3">
                {["加入综述笔记", "生成 comparative narrative", "进入写作工作台"].map((item) => (
                  <Button key={item} className="rounded-[18px] border border-[#dbe1f3] bg-white px-4 py-3 text-sm font-semibold text-[#334155]">
                    {item}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaperReader;
