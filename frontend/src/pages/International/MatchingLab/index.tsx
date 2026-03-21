import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FeatureRecordDialog from "@/feature/FeatureRecordDialog";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { matchingLabAdapter } from "@/pages/International/featureAdapters";
import { matchingLabPageData } from "@/pages/International/featureData";
import { WorkspacePageFrame } from "@/pages/shared/workbench";
import { showToast } from "@/ui/Toast";
import AssistantPanel from "./AssistantPanel";
import HeroSection from "./HeroSection";
import MainPanel from "./MainPanel";

const MatchingLab: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { analysisId } = useParams();
  const { records, createRecord } = useFeatureRecords(matchingLabAdapter);
  const createOpen = location.pathname.endsWith("/new");
  const selected = records.find((record) => record.id === analysisId) ?? records[0] ?? null;

  return (
    <>
      <WorkspacePageFrame
        header={
          <HeroSection
            headline={matchingLabPageData.headline}
            description={matchingLabPageData.description}
            onCreate={() => navigate("/international/matching-lab/analyses/new")}
          />
        }
        initialSplit={64}
        minSplit={48}
        maxSplit={76}
        left={<MainPanel records={records} selected={selected} onOpenRecord={(id) => navigate(`/international/matching-lab/analyses/${id}`)} />}
        right={
          <AssistantPanel
            selected={selected}
            transport={selected ? matchingLabAdapter.createChatTransport(selected.title) : undefined}
          />
        }
      />

      <FeatureRecordDialog
        open={createOpen}
        title="新建匹配分析"
        fields={matchingLabPageData.createFields}
        onClose={() => navigate("/international/matching-lab")}
        onSubmit={(values) => {
          const created = createRecord(values);
          navigate(`/international/matching-lab/analyses/${created.id}`);
          showToast("已创建新的匹配分析");
        }}
      />
    </>
  );
};

export default MatchingLab;
