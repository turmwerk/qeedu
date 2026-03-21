import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FeatureRecordDialog from "@/feature/FeatureRecordDialog";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { paperWritingAdapter } from "@/pages/Research/featureAdapters";
import { paperWritingPageData, paperWritingQuickActions } from "@/pages/Research/featureData";
import { WorkspacePageFrame } from "@/pages/shared/workbench";
import { showToast } from "@/ui/Toast";
import AssistantPanel from "./AssistantPanel";
import Header from "./Header";
import MainPanel from "./MainPanel";

const PaperWriting: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { draftId } = useParams();
  const { records, createRecord, patchRecord } = useFeatureRecords(paperWritingAdapter);
  const selected = records.find((record) => record.id === draftId) ?? records[0] ?? null;
  const [editorText, setEditorText] = useState(selected?.content ?? "");

  useEffect(() => {
    setEditorText(selected?.content ?? "");
  }, [selected?.content]);

  const createOpen = location.pathname.endsWith("/new");

  const appendContent = (content: string, replace = false) => {
    if (!selected) return;
    const next = replace ? content : `${editorText}\n\n${content}`.trim();
    setEditorText(next);
    patchRecord(selected.id, { content: next, updatedAt: Date.now() });
  };

  return (
    <>
      <WorkspacePageFrame
        header={
          <Header
            headline={paperWritingPageData.headline}
            description={paperWritingPageData.description}
            onCreate={() => navigate("/research/paper-writing/drafts/new")}
          />
        }
        initialSplit={68}
        minSplit={52}
        maxSplit={78}
        left={
          <MainPanel
            records={records}
            selected={selected}
            editorText={editorText}
            quickActions={paperWritingQuickActions}
            onOpenRecord={(recordId) => navigate(`/research/paper-writing/drafts/${recordId}`)}
            onEditorChange={setEditorText}
            onSave={() => {
              if (!selected) return;
              patchRecord(selected.id, { content: editorText, updatedAt: Date.now() });
              showToast("草稿已保存");
            }}
            onAppendContent={appendContent}
            onUpdateMilestone={(milestoneId, status) => {
              if (!selected) return;
              patchRecord(selected.id, {
                milestones: (selected.milestones ?? []).map((item: any) =>
                  item.id === milestoneId ? { ...item, status } : item,
                ),
              });
            }}
          />
        }
        right={
          <AssistantPanel
            selected={selected}
            transport={selected ? paperWritingAdapter.createChatTransport(selected.title) : undefined}
          />
        }
      />

      <FeatureRecordDialog
        open={createOpen}
        title="新建论文草稿"
        fields={paperWritingPageData.createFields}
        onClose={() => navigate("/research/paper-writing")}
        onSubmit={(values) => {
          const created = createRecord(values);
          navigate(`/research/paper-writing/drafts/${created.id}`);
          showToast("已创建新的论文草稿");
        }}
        submitText="创建草稿"
      />
    </>
  );
};

export default PaperWriting;
