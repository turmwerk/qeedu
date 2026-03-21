import React from "react";
import { useParams } from "react-router-dom";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { returnServiceAdapter } from "@/pages/International/featureAdapters";
import { returnServicePageData } from "@/pages/International/featureData";
import { WorkspacePageFrame } from "@/pages/shared/workbench";
import AssistantPanel from "./AssistantPanel";
import HeroSection from "./HeroSection";
import MainPanel from "./MainPanel";

const ReturnService: React.FC = () => {
  const { caseId } = useParams();
  const { records } = useFeatureRecords(returnServiceAdapter);
  const selected = records.find((record) => record.id === caseId) ?? records[0] ?? null;

  return (
    <WorkspacePageFrame
      header={
        <HeroSection
          headline={returnServicePageData.headline}
          description={returnServicePageData.description}
          metrics={returnServicePageData.metrics}
        />
      }
      initialSplit={62}
      minSplit={46}
      maxSplit={74}
      left={<MainPanel selected={selected} />}
      right={
        <AssistantPanel
          selected={selected}
          transport={selected ? returnServiceAdapter.createChatTransport(selected.title) : undefined}
        />
      }
    />
  );
};

export default ReturnService;
