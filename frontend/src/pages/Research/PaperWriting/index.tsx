import React from "react";
import {
  ConversationBoard,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";

const PaperWriting: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="text-[34px] font-black leading-tight text-[#243246] md:text-[64px] dark:text-white">
        论文写作与协同
      </div>

      <section className={`${showcasePanelClass} p-6`}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_360px]">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Writing Overview</div>
            <div className="mt-2 text-[28px] font-black text-[#243246] dark:text-white">把摘要、章节推进、引用管理和协作反馈放到一个工作台里</div>
            <div className="mt-3 text-[16px] leading-8 text-[#67748a] dark:text-[#dbe5f3]">
              这里把 literature search 和 paper reader 的输出接入写作阶段，支持 related work 组织、贡献压缩、BibTeX 导出、版本管理和 milestone 跟踪。
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <ShowcaseTag>Outline</ShowcaseTag>
              <ShowcaseTag>Abstract</ShowcaseTag>
              <ShowcaseTag>BibTeX</ShowcaseTag>
              <ShowcaseTag>Milestones</ShowcaseTag>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              ["最近截止", "12 天", "CHI 摘要截止 · 2026/03/28"],
              ["当前状态", "综述初稿", "本周完成主题归纳、gap 梳理与 related work outline"],
              ["协作同步", "写作同步", "明晚前补齐引用、导出 BibTeX，并同步 NJU TeX 模板"],
            ].map(([label, value, detail]) => (
              <div key={label} className={`${showcasePanelClass} p-5`}>
                <div className="text-[14px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">{label}</div>
                <div className="mt-3 text-[34px] font-black text-[#243246] dark:text-white">{value}</div>
                <div className="mt-3 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConversationBoard
        eyebrow="Writing Copilot"
        title="写作推进对话"
        description="围绕摘要、章节结构、related work 和引用安排持续推进写作。"
        messages={[
          {
            role: "Researcher",
            time: "10:06 AM",
            content: "我想先把摘要和 contribution framing 收敛一下，再把 literature search 那边整理的论据接到 related work 里。",
          },
          {
            role: "Writing Copilot",
            time: "10:08 AM",
            content:
              "建议先锁定 contribution framing，再倒推摘要结构和 introduction opening。related work 部分先按 intervention timing、anchoring、flow disruption 三个主题簇组织，然后把 paper reader 输出的证据逐一挂接进去。",
              cards: [
                { title: "摘要", description: "先写问题、方法、主要发现和贡献，不要提前展开所有实验细节。" },
                { title: "Related Work", description: "按主题簇组织，不要按时间线机械堆文献。" },
                { title: "引用", description: "优先把精读过的关键论文转成 BibTeX 并标注用途。" },
              ],
            },
          {
            role: "Researcher",
            time: "10:12 AM",
            content: "帮我给出本周的写作里程碑和协作同步安排，尤其是 figure、引用和 NJU TeX 模板衔接。",
          },
          {
            role: "Writing Copilot",
            time: "10:13 AM",
            content:
              "本周建议分三步推进：今天完成摘要与 section outline；明天同步 figure 列表和 overview figure；后天导出 BibTeX、检查格式并同步 NJU TeX 模板。协作者之间用里程碑代替碎片评论更稳妥。",
            },
        ]}
        summaryTitle="当前写作摘要"
        summaryItems={[
          { title: "当前阶段", description: "综述初稿 / 章节搭建，优先收敛摘要与 contribution framing。" },
          { title: "论据来源", description: "文献检索与论文精读的输出已接入 related work 和 compare queue。" },
          { title: "近期里程碑", description: "摘要、outline、figure list、BibTeX 导出、NJU TeX 同步。" },
          { title: "协作建议", description: "用 milestone + action item 管理同步，而不是只在文档评论区散落反馈。" },
        ]}
        checklistTitle="写作里程碑"
        checklistItems={[
          { title: "确认摘要结构与贡献 framing", description: "确保摘要和 title 一致，不提前展开所有实验细节。", status: "高优先", tone: "red" },
          { title: "完成 related work 主题簇", description: "按 intervention timing、anchoring、flow disruption 聚合文献。", status: "高优先", tone: "red" },
          { title: "检查图表与系统架构图", description: "确认图示与 narrative 一致，优先完成 overview figure。", status: "中优先", tone: "orange" },
          { title: "导出 BibTeX 并同步模板", description: "将 citation export 与 NJU TeX 模板同步。", checked: true, status: "完成", tone: "green" },
        ]}
        promptTabs={["摘要", "章节组织", "引用", "里程碑", "协作反馈"]}
        promptText="继续帮我推进这篇论文的摘要和 related work。请先检查 contribution framing 是否清晰，再给出一个按天拆分的写作里程碑。"
      />
    </div>
  );
};

export default PaperWriting;
