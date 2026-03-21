import React from "react";
import { useParams } from "react-router-dom";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { culturalTrainingAdapter } from "@/pages/International/featureAdapters";
import { culturalTrainingPageData } from "@/pages/International/featureData";
import { WorkspacePageFrame } from "@/pages/shared/workbench";
import AssistantPanel from "./AssistantPanel";
import HeroSection from "./HeroSection";
import MainPanel from "./MainPanel";

const CulturalTraining: React.FC = () => {
  const { profileId } = useParams();
  const { records } = useFeatureRecords(culturalTrainingAdapter);
  const selected = records.find((record) => record.id === profileId) ?? records[0] ?? null;

  return (
    <WorkspacePageFrame
      header={
        <HeroSection
          headline={culturalTrainingPageData.headline}
          description={culturalTrainingPageData.description}
        />
      }
      initialSplit={62}
      minSplit={46}
      maxSplit={74}
      left={<MainPanel selected={selected} />}
      right={
        <AssistantPanel
          selected={selected}
          transport={selected ? culturalTrainingAdapter.createChatTransport(selected.title) : undefined}
        />
      }
    />
  );
};

export default CulturalTraining;
