import React from "react";
import type { AssignmentReviewListPageProps } from "../types";
import PriorityFocusPanel from "./PriorityFocusPanel";
import WorkflowQueuePanel from "./WorkflowQueuePanel";

type LeftPanelProps = Pick<AssignmentReviewListPageProps, "priorityItems" | "queueSummary">;

const AssignmentReviewLeftPanel: React.FC<LeftPanelProps> = ({
  priorityItems,
  queueSummary,
}) => {
  return (
    <div className="flex h-full min-h-[720px] min-w-0 flex-col rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/6">
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        <div className="flex min-w-0 flex-col gap-5">
          <WorkflowQueuePanel queueSummary={queueSummary} />
          <PriorityFocusPanel priorityItems={priorityItems} />
        </div>
      </div>
    </div>
  );
};

export default AssignmentReviewLeftPanel;
