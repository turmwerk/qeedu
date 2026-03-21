import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { exchangeHubAdapter } from "@/pages/International/featureAdapters";
import { exchangeHubPageData } from "@/pages/International/featureData";
import { WorkspacePageFrame } from "@/pages/shared/workbench";
import AssistantPanel from "./AssistantPanel";
import HeroSection from "./HeroSection";
import MainPanel from "./MainPanel";

const ExchangeHub: React.FC = () => {
  const navigate = useNavigate();
  const { programId } = useParams();
  const { records } = useFeatureRecords(exchangeHubAdapter);
  const selected = records.find((record) => record.id === programId) ?? records[0] ?? null;

  return (
    <WorkspacePageFrame
      header={
        <HeroSection
          headline={exchangeHubPageData.headline}
          description={exchangeHubPageData.description}
          metrics={exchangeHubPageData.metrics}
        />
      }
      initialSplit={62}
      minSplit={46}
      maxSplit={74}
      left={<MainPanel records={records} selected={selected} onOpenRecord={(id) => navigate(`/international/exchange-hub/programs/${id}`)} />}
      right={
        <AssistantPanel
          selected={selected}
          transport={selected ? exchangeHubAdapter.createChatTransport(selected.title) : undefined}
        />
      }
    />
  );
};

export default ExchangeHub;
