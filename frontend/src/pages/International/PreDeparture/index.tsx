import React from "react";
import { useParams } from "react-router-dom";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { preDepartureAdapter } from "@/pages/International/featureAdapters";
import { preDeparturePageData } from "@/pages/International/featureData";
import { WorkspacePageFrame } from "@/pages/shared/workbench";
import AssistantPanel from "./AssistantPanel";
import HeroSection from "./HeroSection";
import MainPanel from "./MainPanel";

const PreDeparture: React.FC = () => {
  const { caseId } = useParams();
  const { records, patchRecord } = useFeatureRecords(preDepartureAdapter);
  const selected = records.find((record) => record.id === caseId) ?? records[0] ?? null;

  return (
    <WorkspacePageFrame
      header={
        <HeroSection
          headline={preDeparturePageData.headline}
          description={preDeparturePageData.description}
          metrics={preDeparturePageData.metrics}
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
        />
      }
      right={
        <AssistantPanel
          selected={selected}
          transport={selected ? preDepartureAdapter.createChatTransport(selected.title) : undefined}
        />
      }
    />
  );
};

export default PreDeparture;
