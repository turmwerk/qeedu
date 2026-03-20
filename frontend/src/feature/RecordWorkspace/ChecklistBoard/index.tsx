import React from "react";
import Button from "@/ui/Button";
import type { WorkspaceTask } from "../types";

type Props = {
  tasks: WorkspaceTask[];
  onToggle: (taskId: string) => void;
};

const priorityClassMap: Record<NonNullable<WorkspaceTask["priority"]>, string> = {
  high: "bg-[#fee2e2] text-[#b91c1c] dark:bg-[#7f1d1d]/30 dark:text-[#fecaca]",
  medium: "bg-[#fef3c7] text-[#b45309] dark:bg-[#78350f]/30 dark:text-[#fde68a]",
  low: "bg-[#dcfce7] text-[#15803d] dark:bg-[#14532d]/30 dark:text-[#bbf7d0]",
};

const ChecklistBoard: React.FC<Props> = ({ tasks, onToggle }) => {
  const doneCount = tasks.filter((task) => task.done).length;

  return (
    <div className="rounded-2xl bg-white/[0.88] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-[24px] dark:bg-white/[0.12]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-[16px] font-bold text-[var(--brand-blue)] dark:text-white">
            执行清单
          </div>
          <div className="text-sm text-[#6b7280] dark:text-[#d7e0ef]">
            已完成 {doneCount}/{tasks.length}
          </div>
        </div>
        <div className="h-2 w-28 overflow-hidden rounded-full bg-[#e5e7eb] dark:bg-white/10">
          <div
            className="h-full rounded-full bg-[var(--brand-blue)] transition-[width] duration-300"
            style={{ width: `${tasks.length ? (doneCount / tasks.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="space-y-2.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`rounded-xl border px-3 py-3 transition ${
              task.done
                ? "border-[#bbf7d0] bg-[#f0fdf4] dark:border-[#14532d] dark:bg-[#052e16]/40"
                : "border-[#dbeafe] bg-white/70 dark:border-white/10 dark:bg-white/5"
            }`}
          >
            <div className="flex items-start gap-3">
              <Button
                className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold transition ${
                  task.done
                    ? "border-[#22c55e] bg-[#22c55e] text-white"
                    : "border-[#93c5fd] bg-white text-[#2563eb] dark:bg-transparent"
                }`}
                onClick={() => onToggle(task.id)}
              >
                {task.done ? "✓" : ""}
              </Button>
              <div className="min-w-0 flex-1">
                <div
                  className={`text-sm font-semibold ${
                    task.done
                      ? "text-[#166534] line-through dark:text-[#bbf7d0]"
                      : "text-[#1f2937] dark:text-white"
                  }`}
                >
                  {task.title}
                </div>
                {task.detail && (
                  <div className="mt-1 text-sm leading-6 text-[#6b7280] dark:text-[#d7e0ef]">
                    {task.detail}
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  {task.owner && (
                    <span className="rounded-full bg-[#eef2ff] px-2 py-0.5 text-[12px] font-semibold text-[#4338ca] dark:bg-white/10 dark:text-white">
                      {task.owner}
                    </span>
                  )}
                  {task.due && (
                    <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[12px] font-semibold text-[#475569] dark:bg-white/10 dark:text-[#cbd5e1]">
                      {task.due}
                    </span>
                  )}
                  {task.priority && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[12px] font-semibold ${priorityClassMap[task.priority]}`}
                    >
                      {task.priority === "high"
                        ? "高优先级"
                        : task.priority === "medium"
                          ? "中优先级"
                          : "低优先级"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChecklistBoard;