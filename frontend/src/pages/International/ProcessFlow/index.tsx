import React from "react";
import { useParams } from "react-router-dom";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { processFlowAdapter } from "@/pages/International/featureAdapters";
import { processFlowPageData } from "@/pages/International/featureData";
import { WorkspacePageFrame } from "@/pages/shared/workbench";
import AssistantPanel from "./AssistantPanel";
import HeroSection from "./HeroSection";
import MainPanel from "./MainPanel";

const ProcessFlow: React.FC = () => {
  const { planId } = useParams();
  const { records, patchRecord } = useFeatureRecords(processFlowAdapter);
  const selected = records.find((record) => record.id === planId) ?? records[0] ?? null;

  return (
    <WorkspacePageFrame
      header={
        <HeroSection
          headline={processFlowPageData.headline}
          description={processFlowPageData.description}
          metrics={processFlowPageData.metrics}
        />
      }
      initialSplit={62}
      minSplit={46}
      maxSplit={74}
      left={
        <MainPanel
          selected={selected}
          onToggleTask={(taskId) => {
            if (!selected) return;
            patchRecord(selected.id, {
              tasks: (selected.tasks ?? []).map((task: any) =>
                task.id === taskId ? { ...task, done: !task.done } : task,
              ),
            });
          }}
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
          transport={selected ? processFlowAdapter.createChatTransport(selected.title) : undefined}
        />
      }
    />
  );
};

export default ProcessFlow;
