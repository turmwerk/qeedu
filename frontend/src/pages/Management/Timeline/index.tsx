import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { timelineAdapter } from "@/pages/Management/featureAdapters";
import { timelinePageData } from "@/pages/Management/featureData";
import { WorkspacePageFrame } from "@/pages/shared/workbench";
import AssistantPanel from "./AssistantPanel";
import HeroSection from "./HeroSection";
import MainPanel from "./MainPanel";

const Timeline: React.FC = () => {
  const navigate = useNavigate();
  const { timelineId } = useParams();
  const { records, patchRecord } = useFeatureRecords(timelineAdapter);
  const selected = records.find((record) => record.id === timelineId) ?? records[0] ?? null;

  return (
    <WorkspacePageFrame
      header={
        <HeroSection
          headline={timelinePageData.headline}
          description={timelinePageData.description}
          metrics={timelinePageData.metrics}
        />
      }
      initialSplit={62}
      minSplit={46}
      maxSplit={74}
      left={
        <MainPanel
          records={records}
          selected={selected}
          onOpenRecord={(id) => navigate(`/management/timeline/${id}`)}
          onStatusChange={(milestoneId, status) => {
            if (!selected) return;
            patchRecord(selected.id, {
              milestones: (selected.milestones ?? []).map((item: any) =>
                item.id === milestoneId ? { ...item, status } : item,
              ),
            });
          }}
        />
      }
      right={
        <AssistantPanel
          selected={selected}
          transport={selected ? timelineAdapter.createChatTransport(selected.title) : undefined}
        />
      }
    />
  );
};

export default Timeline;
