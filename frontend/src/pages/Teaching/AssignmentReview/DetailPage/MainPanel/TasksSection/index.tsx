import React, { useMemo } from "react";
import ChecklistBoard from "@/feature/RecordWorkspace/ChecklistBoard";
import type { AssignmentReviewRecord } from "../../../types";

type Props = {
  record: AssignmentReviewRecord;
  onToggleTask: (taskId: string) => void;
};

const TasksSection: React.FC<Props> = ({ record, onToggleTask }) => {
  const tasks = useMemo(
    () =>
      (record.tasks ?? []).map((task) => ({
        ...task,
        owner: task.owner ?? "课程助教",
      })),
    [record.tasks],
  );

  if (!tasks.length) {
    return (
      <div className="rounded-2xl bg-white/[0.88] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-[24px] dark:bg-white/[0.12]">
        <div className="text-[16px] font-bold text-[var(--brand-blue)] dark:text-white">
          执行清单
        </div>
        <div className="mt-2 text-sm leading-6 text-[#6b7280] dark:text-[#d7e0ef]">
          当前任务还没有拆分出具体执行步骤，可以先通过模板生成 rubric 和反馈框架。
        </div>
      </div>
    );
  }

  return <ChecklistBoard tasks={tasks} onToggle={onToggleTask} />;
};

export default TasksSection;
