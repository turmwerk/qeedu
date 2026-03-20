import React from "react";
import { ConversationBoard, ShowcasePanel, showcasePanelClass } from "@/feature/ScenarioShowcase";

const AssignmentReviewDetailPage: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="grid gap-6 xl:grid-cols-[1fr_1.05fr]">
        <ShowcasePanel eyebrow="Rubric" title="程序设计基础 - 第 4 次作业" description="展示当前批改任务的评分标准与样例建议。">
          <div className="grid gap-4">
            {[
              ["功能正确性", "40%", "检查核心逻辑是否满足题意。"],
              ["代码规范", "20%", "关注命名、注释和函数拆分。"],
              ["测试覆盖", "20%", "至少覆盖正常输入、边界条件和异常分支。"],
              ["复杂度说明", "20%", "要求在报告中解释时间和空间复杂度。"],
            ].map(([title, weight, desc]) => (
              <div key={title} className={`${showcasePanelClass} p-5`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[18px] font-black text-[#243246] dark:text-white">{title}</div>
                  <div className="text-[16px] font-semibold text-[#5672ff]">{weight}</div>
                </div>
                <div className="mt-3 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{desc}</div>
              </div>
            ))}
          </div>
        </ShowcasePanel>

        <ConversationBoard
          eyebrow="LLM Feedback"
          title="反馈草稿与订正建议"
          description="在 rubric 基础上生成学生可执行的反馈。"
          messages={[
            {
              role: "批改助手",
              time: "今天 16:08",
              content: "该同学的实现能够通过主要测试，但变量命名混乱、边界情况缺失，建议反馈里先肯定完成度，再指出结构和测试问题。",
            },
            {
              role: "助教",
              time: "今天 16:10",
              content: "请把反馈改得更具体一点，并补一句下次提交前如何自查。",
            },
            {
              role: "批改助手",
              time: "今天 16:11",
              content: "可以补充：提交前请至少补做 3 组边界测试，并检查函数命名是否能直接表达职责。",
            },
          ]}
          summaryTitle="当前状态"
          summaryItems={[
            { title: "学生提交", description: "功能通过主用例，但缺边界测试。"},
            { title: "反馈目标", description: "输出建设性、可执行、便于学生改进的评语。"},
          ]}
          checklistTitle="处理链路"
          checklistItems={[
            { title: "生成初稿", description: "基于 rubric 输出批量反馈。", checked: true, status: "已完成", tone: "green" },
            { title: "人工复核", description: "统一语气，校正不准确判断。", checked: false, status: "进行中", tone: "blue" },
            { title: "回写学生端", description: "同步反馈并追踪订正状态。", checked: false, status: "待执行", tone: "orange" },
          ]}
        />
      </div>
    </div>
  );
};

export default AssignmentReviewDetailPage;
