import React from "react";
import { ConversationBoard, ShowcasePanel, ShowcaseTag, showcasePanelClass } from "@/feature/ScenarioShowcase";

const CareerPlanner: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className={`${showcasePanelClass} p-6`}>
        <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Career Planner</div>
        <div className="mt-2 text-[34px] font-black leading-tight text-[#243246] md:text-[56px] dark:text-white">
          智能生涯规划助手
        </div>
        <div className="mt-4 max-w-3xl text-[16px] leading-8 text-[#67748a] dark:text-[#dbe5f3]">
          以大学四年时间轴、当前能力画像和对话式建议为核心，帮助学生把课程、项目、竞赛、科研和求职准备串成连续路径。
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1.2fr)_320px]">
        <ShowcasePanel eyebrow="Timeline" title="关键成长节点" description="从大一到求职季的建议节奏。">
          <div className="space-y-4">
            {[
              ["大一", "打基础：高数、程序设计、英语表达、社团尝试。"],
              ["大二", "定方向：专业核心课、竞赛/科研入门、作品积累。"],
              ["大三", "拉开差距：科研训练、实习、交换申请或毕业设计准备。"],
              ["大四", "收口输出：保研/申请/求职材料与成果沉淀。"],
            ].map(([title, desc]) => (
              <div key={title} className={`${showcasePanelClass} p-4`}>
                <div className="text-[16px] font-black text-[#243246] dark:text-white">{title}</div>
                <div className="mt-2 text-[14px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{desc}</div>
              </div>
            ))}
          </div>
        </ShowcasePanel>

        <ConversationBoard
          eyebrow="LLM Planner"
          title="规划对话"
          description="根据当前年级、专业和目标方向，生成下一阶段的关键动作。"
          messages={[
            {
              role: "学生",
              time: "今天 09:10",
              content: "我是人工智能学院大二学生，想往科研和算法岗都保留可能性。接下来一年我该怎么安排课程、项目和竞赛？",
            },
            {
              role: "规划助手",
              time: "今天 09:11",
              content: "建议把目标拆成三条并行主线：一条课程主线保证数学、算法和系统基础不掉队；一条项目主线沉淀可展示作品；一条探索主线验证你对科研节奏是否适配。",
              cards: [
                { title: "课程优先级", description: "先把算法、机器学习、线性代数和概率论打实。" },
                { title: "项目优先级", description: "优先做一个能完整讲清楚问题、方法和结果的项目。" },
                { title: "科研试探", description: "找 1 位老师/学长团队先做短周期阅读或小实验。" },
              ],
            },
          ]}
          summaryTitle="当前判断"
          summaryItems={[
            { title: "定位", description: "大二阶段适合同时保留科研与就业两条可能性。" },
            { title: "核心缺口", description: "需要更系统地沉淀项目输出，而不是只上课或只刷题。" },
            { title: "下一动作", description: "先确定暑期方向，形成一份 12 周行动计划。" },
          ]}
          checklistTitle="近期清单"
          checklistSubtitle="尽量用 4 到 6 周验证方向，而不是一次做很大决策。"
          checklistItems={[
            { title: "梳理下学期课程", description: "确认核心课、实验课和可选方向课。", checked: true, status: "已完成", tone: "green" },
            { title: "确定一个展示型项目", description: "优先选择能做成 demo 或报告的题目。", checked: false, status: "进行中", tone: "blue" },
            { title: "联系 1 位潜在科研导师", description: "先用阅读与小任务验证匹配度。", checked: false, status: "待启动", tone: "orange" },
          ]}
          promptTabs={["课程规划", "项目路径", "科研探索"]}
          promptText="基于当前能力画像，输出未来 12 周学习和项目推进计划，并说明每项任务的优先级。"
        />

        <ShowcasePanel eyebrow="Quick Suggestions" title="快捷建议" description="针对不同目标快速给出下一步。">
          <div className="space-y-4">
            {[
              ["保研导向", "优先稳住核心课成绩，提前准备阅读与科研训练。"],
              ["就业导向", "尽快形成可展示项目，补齐实习与面试基础。"],
              ["国际交流", "同步规划 GPA、语言与时间节点，不和核心课冲突。"],
              ["跨学科探索", "选择 1 门交叉课程和 1 个能落地的小项目验证兴趣。"],
            ].map(([title, desc]) => (
              <div key={title} className={`${showcasePanelClass} p-4`}>
                <div className="flex items-center gap-2">
                  <ShowcaseTag>{title}</ShowcaseTag>
                </div>
                <div className="mt-3 text-[14px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{desc}</div>
              </div>
            ))}
          </div>
        </ShowcasePanel>
      </div>
    </div>
  );
};

export default CareerPlanner;
