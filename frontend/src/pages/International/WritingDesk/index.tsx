import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FeatureRecordDialog from "@/feature/FeatureRecordDialog";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { writingDeskAdapter } from "@/pages/International/featureAdapters";
import { writingDeskPageData } from "@/pages/International/featureData";
import { WorkspacePageFrame } from "@/pages/shared/workbench";
import { showToast } from "@/ui/Toast";
import AssistantPanel from "./AssistantPanel";
import HeroSection from "./HeroSection";
import MainPanel from "./MainPanel";

const WritingDesk: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { draftId } = useParams();
  const { records, createRecord, patchRecord } = useFeatureRecords(writingDeskAdapter);
  const selected = records.find((record) => record.id === draftId) ?? records[0] ?? null;
  const createOpen = location.pathname.endsWith("/new");
  const [draftText, setDraftText] = useState(selected?.content ?? "");

  useEffect(() => {
    setDraftText(selected?.content ?? "");
  }, [selected?.content]);

  const appendContent = (content: string, replace = false) => {
    if (!selected) return;
    const next = replace ? content : `${draftText}\n\n${content}`.trim();
    setDraftText(next);
    patchRecord(selected.id, { content: next, updatedAt: Date.now() });
  };

  return (
    <>
      <WorkspacePageFrame
        header={
          <HeroSection
            headline={writingDeskPageData.headline}
            description={writingDeskPageData.description}
            onCreate={() => navigate("/international/writing-desk/drafts/new")}
          />
        }
        initialSplit={68}
        minSplit={52}
        maxSplit={78}
        left={
          <MainPanel
            records={records}
            selected={selected}
            draftText={draftText}
            onOpenRecord={(id) => navigate(`/international/writing-desk/drafts/${id}`)}
            onDraftChange={setDraftText}
            onSave={() => {
              if (!selected) return;
              patchRecord(selected.id, { content: draftText, updatedAt: Date.now() });
              showToast("草稿已保存");
            }}
            onAppendContent={appendContent}
          />
        }
        right={
          <AssistantPanel
            selected={selected}
            transport={selected ? writingDeskAdapter.createChatTransport(selected.title) : undefined}
          />
        }
      />

      <FeatureRecordDialog
        open={createOpen}
        title="新建沟通草稿"
        fields={writingDeskPageData.createFields}
        onClose={() => navigate("/international/writing-desk")}
        onSubmit={(values) => {
          const created = createRecord(values);
          navigate(`/international/writing-desk/drafts/${created.id}`);
          showToast("已创建新的沟通草稿");
        }}
      />
    </>
  );
};

export default WritingDesk;
