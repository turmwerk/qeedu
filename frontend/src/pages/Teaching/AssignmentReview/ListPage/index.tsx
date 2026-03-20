import React from "react";
import { RecordList } from "@/feature/ScenarioShowcase";

const AssignmentReviewListPage: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <RecordList
        eyebrow="List Page"
        title="批改任务列表"
        description="本轮先落地作业批改列表页，后续再接真实记录与筛选能力。"
        actionLabel="新建批改任务"
        records={[
          {
            title: "程序设计基础 - 第 4 次作业",
            meta: "课程负责人：张老师 · 89 份提交",
            summary: "目标输出：结构化评语、扣分说明、常见错误归纳。",
            status: "待批改",
            tags: ["编程", "截止今日"],
            actions: [{ label: "进入详情", primary: true }, { label: "导出 rubric" }],
          },
          {
            title: "数据库系统 - 实验报告 2",
            meta: "课程负责人：李老师 · 42 份提交",
            summary: "目标输出：每位学生的 SQL 逻辑反馈和实验报告建议。",
            status: "复核中",
            tags: ["实验报告", "反馈生成"],
            actions: [{ label: "继续复核", primary: true }, { label: "查看样例" }],
          },
        ]}
      />
    </div>
  );
};

export default AssignmentReviewListPage;
