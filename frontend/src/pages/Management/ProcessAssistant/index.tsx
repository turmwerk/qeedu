import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FeatureRecordDialog from "@/feature/FeatureRecordDialog";
import ConfirmDialog from "@/ui/ConfirmDialog";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { processAssistantAdapter } from "@/pages/Management/featureAdapters";
import { processAssistantPageData } from "@/pages/Management/featureData";
import { WorkspacePageFrame } from "@/pages/shared/workbench";
import { showToast } from "@/ui/Toast";
import AssistantPanel from "./AssistantPanel";
import HeroSection from "./HeroSection";
import MainPanel from "./MainPanel";

const ProcessAssistant: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { caseId } = useParams();
  const { records, createRecord, patchRecord, removeRecord } = useFeatureRecords(processAssistantAdapter);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const createOpen = location.pathname.endsWith("/new");
  const selected = records.find((record) => record.id === caseId) ?? records[0] ?? null;

  return (
    <>
      <WorkspacePageFrame
        header={
          <HeroSection
            headline={processAssistantPageData.headline}
            description={processAssistantPageData.description}
            onOpenOverview={() => navigate("/management/process-assistant")}
            onCreate={() => navigate("/management/process-assistant/cases/new")}
          />
        }
        initialSplit={62}
        minSplit={46}
        maxSplit={74}
        left={
          <MainPanel
            records={records}
            selected={selected}
            onOpenRecord={(id) => navigate(`/management/process-assistant/cases/${id}`)}
            onRequestDelete={setDeleteId}
            onUpdateSelected={(patch) => {
              if (!selected) return;
              patchRecord(selected.id, patch);
            }}
          />
        }
        right={
          <AssistantPanel
            selected={selected}
            transport={selected ? processAssistantAdapter.createChatTransport(selected.title) : undefined}
          />
        }
      />

      <FeatureRecordDialog
        open={createOpen}
        title="新建事务案例"
        fields={processAssistantPageData.createFields}
        onClose={() => navigate("/management/process-assistant")}
        onSubmit={(values) => {
          const created = createRecord(values);
          navigate(`/management/process-assistant/cases/${created.id}`);
          showToast("已创建事务案例");
        }}
        submitText="创建案例"
      />

      <ConfirmDialog
        open={!!deleteId}
        title="删除事务案例"
        description="删除后该案例的本地流程记录会被移除。"
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            removeRecord(deleteId);
            if (caseId === deleteId) navigate("/management/process-assistant");
            showToast("已删除事务案例");
          }
          setDeleteId(null);
        }}
      />
    </>
  );
};

export default ProcessAssistant;
