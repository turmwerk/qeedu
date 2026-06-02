import React from "react";
import { priorityClassMap } from "../../constants";
import type { PriorityItem } from "../../types";

type PriorityFocusPanelProps = {
  priorityItems: PriorityItem[];
};

const PriorityFocusPanel: React.FC<PriorityFocusPanelProps> = ({ priorityItems }) => {
  return (
    <section className="workbench-surface-accent rounded-[24px] border border-cyan-200/70 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.98)_0%,rgba(236,254,255,0.96)_34%,rgba(224,231,255,0.92)_100%)] p-4 shadow-[0_18px_40px_rgba(56,189,248,0.14)]">
      <div className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-600/80">
        Priority Focus
      </div>
      <div className="mt-3 space-y-3">
        {priorityItems.length ? (
          priorityItems.map((item) => (
            <div
              key={item.id}
              className="workbench-surface-muted rounded-[22px] border border-white/90 bg-white/85 px-4 py-3 shadow-[0_12px_26px_rgba(14,116,144,0.08)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                {item.priority ? (
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityClassMap[item.priority]}`}
                  >
                    {item.priority === "high"
                      ? "高优先级"
                      : item.priority === "medium"
                        ? "中优先级"
                        : "低优先级"}
                  </span>
                ) : null}
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</div>
            </div>
          ))
        ) : (
          <div className="workbench-surface-muted rounded-[22px] border border-dashed border-cyan-200 bg-white/70 px-4 py-6 text-sm text-slate-500">
            当前没有未完成的高优先级步骤，可以从右侧任务列表进入具体批改。
          </div>
        )}
      </div>
    </section>
  );
};

export default PriorityFocusPanel;
