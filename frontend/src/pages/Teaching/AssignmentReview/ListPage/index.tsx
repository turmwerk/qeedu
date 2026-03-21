import React from "react";
import SplitSiderLayout from "@/layouts/SplitSiderLayout";
import HeroSection from "./HeroSection";
import LeftPanel from "./LeftPanel";
import TaskListPanel from "./TaskListPanel";
import type { AssignmentReviewListPageProps } from "./types";

const AssignmentReviewListPage: React.FC<AssignmentReviewListPageProps> = ({
  records,
  hasRecords,
  keyword,
  metrics,
  queueSummary,
  priorityItems,
  onKeywordChange,
  onOpenRecord,
  onOpenLatest,
  onOpenCreate,
  onDuplicateRecord,
  onDeleteRecord,
}) => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <HeroSection
        metrics={metrics}
        hasRecords={hasRecords}
        onOpenLatest={onOpenLatest}
        onOpenCreate={onOpenCreate}
      />

      <SplitSiderLayout
        initialSplit={46}
        minSplit={30}
        maxSplit={70}
        className="min-h-[720px] min-w-0"
        leftClassName="flex min-w-0 flex-col"
        rightClassName="flex min-w-0 flex-col"
        left={
          <div className="flex h-full min-h-[720px] min-w-0 flex-col">
            <LeftPanel
              queueSummary={queueSummary}
              priorityItems={priorityItems}
            />
          </div>
        }
        right={
          <div className="flex h-full min-h-[720px] min-w-0 flex-col">
            <TaskListPanel
              records={records}
              hasRecords={hasRecords}
              keyword={keyword}
              onKeywordChange={onKeywordChange}
              onOpenRecord={onOpenRecord}
              onDuplicateRecord={onDuplicateRecord}
              onDeleteRecord={onDeleteRecord}
            />
          </div>
        }
      />
    </div>
  );
};

export default AssignmentReviewListPage;
