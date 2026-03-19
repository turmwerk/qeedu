import React from "react";
import type { WorkspaceMetric } from "./types";

type Props = {
  metrics: WorkspaceMetric[];
};

const OverviewMetrics: React.FC<Props> = ({ metrics }) => {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-2xl bg-white/[0.78] px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-[24px] dark:bg-white/[0.12]"
        >
          <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#75839a] dark:text-[#cbd5e1]">
            {metric.label}
          </div>
          <div className="mt-2 text-[22px] font-extrabold leading-none text-[var(--brand-blue)] dark:text-white">
            {metric.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewMetrics;

