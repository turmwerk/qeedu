import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FeatureRecordDialog from "@/feature/FeatureRecordDialog";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { materialsCenterAdapter } from "@/pages/Management/featureAdapters";
import { materialsCenterPageData } from "@/pages/Management/featureData";
import { WorkspacePageFrame } from "@/pages/shared/workbench";
import { showToast } from "@/ui/Toast";
import AssistantPanel from "./AssistantPanel";
import HeroSection from "./HeroSection";
import MainPanel from "./MainPanel";

const MaterialsCenter: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collectionId } = useParams();
  const { records, createRecord, patchRecord } = useFeatureRecords(materialsCenterAdapter);
  const createOpen = location.pathname.endsWith("/collections/new");
  const selected = records.find((record) => record.id === collectionId) ?? records[0] ?? null;

  return (
    <>
      <WorkspacePageFrame
        header={
          <HeroSection
            headline={materialsCenterPageData.headline}
            description={materialsCenterPageData.description}
            onCreate={() => navigate("/management/materials-center/collections/new")}
          />
        }
        initialSplit={64}
        minSplit={48}
        maxSplit={76}
        left={
          <MainPanel
            records={records}
            selected={selected}
            onOpenRecord={(id) => navigate(`/management/materials-center/collections/${id}`)}
            onUpdateSelected={(patch) => {
              if (!selected) return;
              patchRecord(selected.id, patch);
            }}
          />
        }
        right={
          <AssistantPanel
            selected={selected}
            transport={selected ? materialsCenterAdapter.createChatTransport(selected.title) : undefined}
          />
        }
      />

      <FeatureRecordDialog
        open={createOpen}
        title="新建材料集合"
        fields={materialsCenterPageData.createFields}
        onClose={() => navigate("/management/materials-center")}
        onSubmit={(values) => {
          const created = createRecord(values);
          navigate(`/management/materials-center/collections/${created.id}`);
          showToast("已创建材料集合");
        }}
        submitText="创建集合"
      />
    </>
  );
};

export default MaterialsCenter;
