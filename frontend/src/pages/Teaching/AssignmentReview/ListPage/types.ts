import type { WorkspaceMetric } from "@/feature/RecordWorkspace/types";
import type { AssignmentReviewRecord } from "../types";

export type QueueSummaryItem = {
  label: string;
  value: string;
  hint: string;
  tone: "blue" | "green" | "orange";
};

export type PriorityItem = {
  id: string;
  title: string;
  detail: string;
  priority?: "high" | "medium" | "low";
};

export type AssignmentReviewListPageProps = {
  records: AssignmentReviewRecord[];
  hasRecords: boolean;
  keyword: string;
  metrics: WorkspaceMetric[];
  queueSummary: QueueSummaryItem[];
  priorityItems: PriorityItem[];
  onKeywordChange: (value: string) => void;
  onOpenRecord: (id: string) => void;
  onOpenLatest: () => void;
  onOpenCreate: () => void;
  onDuplicateRecord: (id: string) => void;
  onDeleteRecord: (id: string) => void;
};
