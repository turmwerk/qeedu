import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { paperReaderAdapter } from "@/pages/Research/featureAdapters";
import { paperReaderPageData, paperReaderQuickActions } from "@/pages/Research/featureData";
import { WorkspacePageFrame } from "@/pages/shared/workbench";
import AssistantPanel from "./AssistantPanel";
import Header from "./Header";
import MainPanel from "./MainPanel";

const PaperReader: React.FC = () => {
  const navigate = useNavigate();
  const { paperId } = useParams();
  const { records } = useFeatureRecords(paperReaderAdapter);
  const selected = records.find((record) => record.id === paperId) ?? records[0] ?? null;

  return (
    <WorkspacePageFrame
      header={
        <Header
          headline={paperReaderPageData.headline}
          description={paperReaderPageData.description}
        />
      }
      initialSplit={64}
      minSplit={48}
      maxSplit={76}
      left={
        <MainPanel
          records={records}
          selected={selected}
          quickActions={paperReaderQuickActions}
          onOpenRecord={(recordId) => navigate(`/research/paper-reader/papers/${recordId}`)}
          onOpenWriter={() => navigate("/research/paper-writing")}
        />
      }
      right={
        <AssistantPanel
          selected={selected}
          transport={selected ? paperReaderAdapter.createChatTransport(selected.title) : undefined}
        />
      }
    />
  );
};

export default PaperReader;
