import type { ReactNode } from "react";
import type { WorkspaceMetric } from "../types";

export type OverviewMetricsProps = {
  metrics: WorkspaceMetric[];
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
  headerClassName?: string;
  gridClassName?: string;
  headerAlign?: "left" | "center";
  hideHeader?: boolean;
};
