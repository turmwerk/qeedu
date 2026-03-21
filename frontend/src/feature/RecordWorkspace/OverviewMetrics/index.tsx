import React from "react";
import MetricsGrid from "./MetricsGrid";
import OverviewMetricsHeader from "./OverviewMetricsHeader";
import type { OverviewMetricsProps } from "./types";

const defaultTitle = "工作区概览";
const defaultSubtitle =
  "查看工作区的关键指标和活动统计，掌握项目进展情况和团队协作状态";

const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  metrics,
  title,
  subtitle,
  actions,
  className,
  headerClassName,
  gridClassName,
  headerAlign = "left",
  hideHeader = false,
}) => {
  const resolvedTitle = title ?? defaultTitle;
  const resolvedSubtitle = subtitle ?? defaultSubtitle;

  return (
    <div className={`space-y-6 ${className ?? ""}`}>
      {!hideHeader ? (
        <OverviewMetricsHeader
          title={resolvedTitle}
          subtitle={resolvedSubtitle}
          actions={actions}
          align={headerAlign}
          className={headerClassName}
        />
      ) : null}
      <MetricsGrid metrics={metrics} className={gridClassName} />
    </div>
  );
};

export default OverviewMetrics;
