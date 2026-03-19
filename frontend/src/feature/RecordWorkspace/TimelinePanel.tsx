import React from "react";
import Dropdown from "@/ui/Dropdown";
import type { WorkspaceMilestone, WorkspaceMilestoneStatus } from "./types";

type Props = {
  milestones: WorkspaceMilestone[];
  onStatusChange: (milestoneId: string, status: WorkspaceMilestoneStatus) => void;
};

const statusLabelMap: Record<WorkspaceMilestoneStatus, string> = {
  todo: "未开始",
  doing: "进行中",
  done: "已完成",
  risk: "风险中",
};

const statusClassMap: Record<WorkspaceMilestoneStatus, string> = {
  todo: "bg-[#e0f2fe] text-[#0369a1] dark:bg-[#082f49]/50 dark:text-[#7dd3fc]",
  doing: "bg-[#ede9fe] text-[#6d28d9] dark:bg-[#2e1065]/40 dark:text-[#c4b5fd]",
  done: "bg-[#dcfce7] text-[#15803d] dark:bg-[#14532d]/40 dark:text-[#bbf7d0]",
  risk: "bg-[#fee2e2] text-[#b91c1c] dark:bg-[#7f1d1d]/40 dark:text-[#fecaca]",
};

const TimelinePanel: React.FC<Props> = ({ milestones, onStatusChange }) => {
  return (
    <div className="rounded-2xl bg-white/[0.88] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-[24px] dark:bg-white/[0.12]">
      <div className="mb-3">
        <div className="text-[16px] font-bold text-[var(--brand-blue)] dark:text-white">
          里程碑时间线
        </div>
        <div className="text-sm text-[#6b7280] dark:text-[#d7e0ef]">
          关键节点可直接在这里调整进度状态。
        </div>
      </div>

      <div className="space-y-3">
        {milestones.map((item, index) => (
          <div key={item.id} className="relative pl-6">
            {index !== milestones.length - 1 && (
              <div className="absolute left-[10px] top-6 h-[calc(100%+4px)] w-[2px] bg-[#dbeafe] dark:bg-white/10" />
            )}
            <div className="absolute left-0 top-1.5 h-5 w-5 rounded-full bg-[var(--brand-blue)] shadow-[0_0_0_4px_rgba(59,130,246,0.12)]" />
            <div className="rounded-xl border border-[#dbeafe] bg-white/70 px-3 py-3 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-[#1f2937] dark:text-white">
                    {item.title}
                  </div>
                  {item.summary && (
                    <div className="mt-1 text-sm leading-6 text-[#6b7280] dark:text-[#d7e0ef]">
                      {item.summary}
                    </div>
                  )}
                </div>
                <Dropdown
                  button={<span>{statusLabelMap[item.status]}</span>}
                  buttonClassName={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${statusClassMap[item.status]}`}
                  items={(Object.keys(statusLabelMap) as WorkspaceMilestoneStatus[]).map((status) => ({
                    label: statusLabelMap[status],
                    active: item.status === status,
                    onClick: () => onStatusChange(item.id, status),
                  }))}
                  showCheck
                  portalToBody
                />
              </div>
              {item.date && (
                <div className="mt-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94a3b8] dark:text-[#cbd5e1]">
                  {item.date}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelinePanel;

