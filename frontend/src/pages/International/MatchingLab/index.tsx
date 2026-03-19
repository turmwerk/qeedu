import React from "react";
import Button from "@/ui/Button";
import {
  ConversationBoard,
  RecordList,
  ShowcasePanel,
  ShowcaseTag,
  showcasePanelClass,
} from "@/feature/ScenarioShowcase";

const MatchingLab: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="text-[34px] font-black leading-tight text-[#243246] md:text-[64px] dark:text-white">
        智能项目匹配与申请决策
      </div>

      <RecordList
        eyebrow="History Records"
        title="历史分析记录"
        description="点击一条记录继续分析，或删除不再需要的旧会话。"
        actionLabel="新增分析"
        records={[
          {
            title: "Canada / Singapore 交换项目分析",
            meta: "创建于 2026/03/17 · 最近更新 12 分钟前",
            status: "进行中",
            tags: ["TOEFL 102", "CS / HCI", "预算中等", "2026 秋季"],
            actions: [{ label: "继续分析", primary: true }, { label: "查看摘要" }, { label: "删除" }],
          },
          {
            title: "暑校优先方案比较",
            meta: "创建于 2026/03/15 · 最近更新 1 天前",
            status: "已完成",
            tags: ["暑校", "Singapore / Japan", "费用敏感"],
            actions: [{ label: "继续分析", primary: true }, { label: "查看摘要" }, { label: "删除" }],
          },
          {
            title: "研究导向联合培养评估",
            meta: "创建于 2026/03/11 · 最近更新 4 天前",
            status: "已归档",
            tags: ["联合培养", "Research fit", "导师匹配优先"],
            actions: [{ label: "继续分析", primary: true }, { label: "查看摘要" }, { label: "删除" }],
          },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <ShowcasePanel
          eyebrow="New Analysis"
          title="新增分析"
          description="填写必要背景信息后，确认即可创建一条新的分析记录，并直接进入对应的大模型对话。"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["GPA", "3.72 / 4.0"],
              ["语言成绩", "TOEFL 102"],
              ["专业背景", "Computer Science"],
              ["研究方向", "HCI / AI"],
              ["预算范围", "¥ 80,000 - 150,000 / 学期"],
              ["时间安排", "2026 秋季学期"],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 text-[15px] font-bold text-[#243246] dark:text-white">{label}</div>
                <div className={`${showcasePanelClass} px-5 py-4 text-[16px] text-[#475569] dark:text-[#dbe5f3]`}>{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <div className="mb-2 text-[15px] font-bold text-[#243246] dark:text-white">目标国家 / 地区</div>
            <div className="flex flex-wrap gap-2">
              {["Canada", "Singapore", "Japan", "UK", "Europe"].map((item, index) => (
                <ShowcaseTag key={item} tone={index < 2 ? "blue" : "gray"}>
                  {item}
                </ShowcaseTag>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-2 text-[15px] font-bold text-[#243246] dark:text-white">补充偏好</div>
            <div className={`${showcasePanelClass} min-h-[160px] px-5 py-4 text-[16px] leading-8 text-[#475569] dark:text-[#dbe5f3]`}>
              希望优先考虑课程匹配度高、预算压力适中、学分转换规则较成熟的项目。如果有 HCI 或跨学科设计相关课程会更好。
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <ShowcaseTag>课程匹配度优先</ShowcaseTag>
            <ShowcaseTag>预算可控</ShowcaseTag>
            <ShowcaseTag tone="gray">录取难度保守</ShowcaseTag>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button className="rounded-[20px] border border-[#dbe1f3] bg-white px-5 py-3 text-sm font-semibold text-[#334155]">取消</Button>
            <Button className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white">确认并开始分析</Button>
          </div>
        </ShowcasePanel>

        <ConversationBoard
          eyebrow="Current Session"
          title="新分析 · Canada / Singapore 交换项目匹配"
          description="已根据刚填写的表单创建新的分析记录，现在开始进入大模型推荐与比较对话。"
          messages={[
            {
              role: "Applicant",
              time: "10:12 AM",
              content:
                "我已经填写了 GPA、语言成绩、专业背景和预算。请先根据这些条件给我推荐几个适合的交换或暑校项目，并说明为什么适合我。",
            },
            {
              role: "Matching Copilot",
              time: "10:13 AM",
              content:
                "基于你目前的画像，我会优先推荐课程匹配度高、预算压力适中、学分转换明确的项目。初步最适合的方向是 UBC Exchange、NUS Summer School 和 KU Leuven Joint Training。",
              cards: [
                { title: "UBC Exchange", description: "课程匹配度高，英语门槛与你当前成绩匹配，学费互免降低预算压力。" },
                { title: "NUS Summer School", description: "时间灵活、课程丰富，但整体费用更高，更适合作为短期补体验型选择。" },
                { title: "KU Leuven Joint Training", description: "研究导向更强，适合长期规划，但录取不确定性和申请复杂度更高。" },
              ],
            },
            {
              role: "Applicant",
              time: "10:15 AM",
              content:
                "帮我比较这三个项目，重点看录取难度、预算压力、课程匹配度和申请风险。最后给我一个优先级排序。",
            },
            {
              role: "Matching Copilot",
              time: "10:16 AM",
              content:
                "如果以你当前条件为基础，UBC Exchange 是最平衡的选择；NUS Summer School 更适合把它当作灵活的短期补充选项；KU Leuven Joint Training 更偏研究型，适合把它放在冲刺位，但申请复杂度最高。",
              cards: [
                { title: "优先级 1", description: "UBC Exchange：综合适配度最高，风险与收益最平衡。" },
                { title: "优先级 2", description: "NUS Summer School：灵活、直观，但费用压力偏高。" },
                { title: "优先级 3", description: "KU Leuven Joint Training：适合冲刺，但申请风险更高。" },
              ],
            },
          ]}
          summaryTitle="当前分析摘要"
          summaryItems={[
            { title: "用户画像", description: "CS / HCI、TOEFL 102、预算中等，目标国家偏向 Canada 与 Singapore，课程匹配度优先。" },
            { title: "当前推荐排序", description: "1. UBC Exchange 2. NUS Summer School 3. KU Leuven Joint Training" },
            { title: "主要判断依据", description: "课程匹配度、学分转换成熟度、预算压力与整体申请风险。" },
            { title: "下一步建议", description: "继续让 LLM 输出正式比较表，并针对第一志愿生成申请准备清单。" },
          ]}
          promptTabs={["项目推荐", "多项目比较", "申请风险分析", "预算压力评估"]}
          promptText="继续比较 UBC、NUS 和 KU Leuven 这三个项目。请分别说明录取难度、预算压力、课程匹配度、语言门槛和申请风险，并给出一个更细的申请建议。"
          promptSuffix="历史画像已附加"
        />
      </div>
    </div>
  );
};

export default MatchingLab;
