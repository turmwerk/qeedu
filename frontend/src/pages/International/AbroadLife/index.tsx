import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { abroadLifeAdapter } from "@/pages/International/featureAdapters";
import { abroadLifePageData } from "@/pages/International/featureData";
import { WorkspacePageFrame } from "@/pages/shared/workbench";
import AssistantPanel from "./AssistantPanel";
import HeroSection from "./HeroSection";
import MainPanel from "./MainPanel";

const AbroadLife: React.FC = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const { records } = useFeatureRecords(abroadLifeAdapter);
  const selected = records.find((record) => record.id === ticketId) ?? records[0] ?? null;

  return (
    <WorkspacePageFrame
      header={
        <HeroSection
          headline={abroadLifePageData.headline}
          description={abroadLifePageData.description}
          metrics={abroadLifePageData.metrics}
        />
      }
      initialSplit={62}
      minSplit={46}
      maxSplit={74}
      left={<MainPanel records={records} selected={selected} onOpenRecord={(id) => navigate(`/international/abroad-life/tickets/${id}`)} />}
      right={
        <AssistantPanel
          selected={selected}
          transport={selected ? abroadLifeAdapter.createChatTransport(selected.title) : undefined}
        />
      }
    />
  );
};

export default AbroadLife;
