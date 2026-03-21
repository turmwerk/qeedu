import React from "react";
import type { WorkspaceMetric } from "../../types";
import MetricCard from "../MetricCard";

type Props = {
  metrics: WorkspaceMetric[];
  className?: string;
};

const MetricsGrid: React.FC<Props> = ({ metrics, className }) => {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-4 ${className ?? ""}`}>
      {metrics.map((metric) => (
        <MetricCard key={`${metric.label}-${metric.value}`} metric={metric} />
      ))}
    </div>
  );
};

export default MetricsGrid;
