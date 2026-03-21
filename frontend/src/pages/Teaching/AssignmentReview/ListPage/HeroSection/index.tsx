import React from "react";
import OverviewMetrics from "@/feature/RecordWorkspace/OverviewMetrics";
import { assignmentReviewPageData } from "@/pages/Teaching/featureData";
import Button from "@/ui/Button";
import type { WorkspaceMetric } from "@/feature/RecordWorkspace/types";

type HeroSectionProps = {
  metrics: WorkspaceMetric[];
  hasRecords: boolean;
  onOpenLatest: () => void;
  onOpenCreate: () => void;
};

const HeroSection: React.FC<HeroSectionProps> = ({
  metrics,
  hasRecords,
  onOpenLatest,
  onOpenCreate,
}) => {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-[linear-gradient(135deg,#f8fbff_0%,#eef4ff_52%,#fff7ed_100%)] p-6 shadow-[0_22px_48px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(30,41,59,0.9)_0%,rgba(30,64,175,0.24)_100%)]">
      <OverviewMetrics
        metrics={metrics}
        headerAlign="left"
        gridClassName="xl:grid-cols-3"
        title={
          <span className="text-3xl font-black text-slate-900 dark:text-white">
            {assignmentReviewPageData.headline}
          </span>
        }
        subtitle={
          <div className="space-y-2">
            <div className="text-sm text-slate-600 dark:text-slate-300">
              {assignmentReviewPageData.subtitle}
            </div>
            <div className="max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              {assignmentReviewPageData.description}
            </div>
          </div>
        }
        actions={
          <>
            <Button variant="secondary" onClick={onOpenLatest} disabled={!hasRecords}>
              继续最近任务
            </Button>
            <Button variant="primary" onClick={onOpenCreate}>
              新建批改任务
            </Button>
          </>
        }
      />
    </section>
  );
};

export default HeroSection;
