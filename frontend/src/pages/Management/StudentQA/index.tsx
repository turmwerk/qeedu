import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FeatureRecordDialog from "@/feature/FeatureRecordDialog";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { studentQAAdapter } from "@/pages/Management/featureAdapters";
import { studentQAPageData } from "@/pages/Management/featureData";
import { WorkspacePageFrame } from "@/pages/shared/workbench";
import { showToast } from "@/ui/Toast";
import AssistantPanel from "./AssistantPanel";
import HeroSection from "./HeroSection";
import MainPanel from "./MainPanel";

const StudentQA: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { threadId } = useParams();
  const { records, createRecord, patchRecord } = useFeatureRecords(studentQAAdapter);
  const createOpen = location.pathname.endsWith("/new");
  const selected = records.find((record) => record.id === threadId) ?? records[0] ?? null;

  return (
    <>
      <WorkspacePageFrame
        header={
          <HeroSection
            headline={studentQAPageData.headline}
            description={studentQAPageData.description}
            onCreate={() => navigate("/management/student-qa/threads/new")}
          />
        }
        initialSplit={64}
        minSplit={48}
        maxSplit={76}
        left={
          <MainPanel
            records={records}
            selected={selected}
            onOpenRecord={(id) => navigate(`/management/student-qa/threads/${id}`)}
            onUpdateSelected={(patch) => {
              if (!selected) return;
              patchRecord(selected.id, patch);
            }}
          />
        }
        right={
          <AssistantPanel
            selected={selected}
            transport={selected ? studentQAAdapter.createChatTransport(selected.title) : undefined}
          />
        }
      />

      <FeatureRecordDialog
        open={createOpen}
        title="新建问答线程"
        fields={studentQAPageData.createFields}
        onClose={() => navigate("/management/student-qa")}
        onSubmit={(values) => {
          const created = createRecord(values);
          navigate(`/management/student-qa/threads/${created.id}`);
          showToast("已创建问答线程");
        }}
      />
    </>
  );
};

export default StudentQA;
