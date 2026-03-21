import React from "react";
import { useParams } from "react-router-dom";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { welcomePortalAdapter } from "@/pages/International/featureAdapters";
import { welcomePortalPageData } from "@/pages/International/featureData";
import { WorkspacePageFrame } from "@/pages/shared/workbench";
import AssistantPanel from "./AssistantPanel";
import HeroSection from "./HeroSection";
import MainPanel from "./MainPanel";

const WelcomePortal: React.FC = () => {
  const { caseId } = useParams();
  const { records } = useFeatureRecords(welcomePortalAdapter);
  const selected = records.find((record) => record.id === caseId) ?? records[0] ?? null;

  return (
    <WorkspacePageFrame
      header={
        <HeroSection
          headline={welcomePortalPageData.headline}
          description={welcomePortalPageData.description}
          metrics={welcomePortalPageData.metrics}
        />
      }
      initialSplit={62}
      minSplit={46}
      maxSplit={74}
      left={<MainPanel selected={selected} />}
      right={
        <AssistantPanel
          selected={selected}
          transport={selected ? welcomePortalAdapter.createChatTransport(selected.title) : undefined}
        />
      }
    />
  );
};

export default WelcomePortal;
