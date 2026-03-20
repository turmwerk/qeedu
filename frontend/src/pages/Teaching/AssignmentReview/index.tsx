import React from "react";
import { useNavigate } from "react-router-dom";
import { ConversationBoard, RecordList, showcasePanelClass } from "@/feature/ScenarioShowcase";
import Button from "@/ui/Button";

const AssignmentReview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <section className={`${showcasePanelClass} p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Assignment Review</div>
            <div className="mt-2 text-[34px] font-black text-[#243246] dark:text-white">作业批改与反馈</div>
            <div className="mt-3 max-w-3xl text-[16px] leading-8 text-[#67748a] dark:text-[#dbe5f3]">
              统一管理批改任务、rubric、LLM 反馈草稿和学生订正状态，作为助教模块的第三条正式子链路。
            </div>
          </div>
          <Button
            className="rounded-2xl bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white"
            onClick={() => navigate("/teaching/assignment-review/ListPage")}
          >
            查看任务列表
          </Button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.05fr]">
        <RecordList
          eyebrow="Tasks"
          title="当前批改任务"
          description="按课程、截止时间和风险等级统一编排。"
          records={[
            {
              title: "程序设计基础 - 第 4 次作业",
              meta: "89 份待批改 · 截止今晚 23:59",
              summary: "重点关注代码规范、复杂度说明和测试覆盖率。",
              status: "高优先级",
              tags: ["编程作业", "自动评分+人工复核"],
              actions: [{ label: "进入批改", primary: true }, { label: "查看 rubric" }],
            },
            {
              title: "数据库系统 - 实验报告 2",
              meta: "42 份待复核 · 下周一前完成",
              summary: "已有初步自动评语，需要统一语气并补充个性化建议。",
              status: "进行中",
              tags: ["实验报告", "LLM 反馈"],
              actions: [{ label: "继续处理", primary: true }, { label: "导出结果" }],
            },
          ]}
        />

        <ConversationBoard
          eyebrow="Feedback Copilot"
          title="反馈生成逻辑"
          description="把 rubric、样例答案和学生表现结合起来，生成结构化反馈。"
          messages={[
            {
              role: "助教",
              time: "今天 15:04",
              content: "请根据这份程序设计作业的 rubric，为实现正确但命名混乱、测试不足的学生生成一段建设性反馈。",
            },
            {
              role: "批改助手",
              time: "今天 15:05",
              content: "建议按三段结构输出：先确认功能完成度，再指出可改进点，最后给出下一次作业的具体行动建议。",
              cards: [
                { title: "功能完成", description: "核心逻辑正确，主要用例通过。" },
                { title: "改进点", description: "变量命名与函数拆分仍影响可读性。" },
                { title: "行动建议", description: "补齐边界测试并增加复杂度说明。" },
              ],
            },
          ]}
          summaryTitle="批改要素"
          summaryItems={[
            { title: "Rubric", description: "正确性、规范性、复杂度分析、测试覆盖率。"},
            { title: "输出目标", description: "可直接回写给学生的结构化反馈。"},
          ]}
          checklistTitle="落地步骤"
          checklistItems={[
            { title: "导入 rubric", description: "按课程和作业类型切换评分标准。", checked: true, status: "已配置", tone: "green" },
            { title: "生成反馈草稿", description: "先批量生成，再做抽样人工复核。", checked: false, status: "进行中", tone: "blue" },
            { title: "跟踪订正状态", description: "记录学生是否已根据反馈修改。", checked: false, status: "待开启", tone: "orange" },
          ]}
        />
      </div>
    </div>
  );
};

export default AssignmentReview;
