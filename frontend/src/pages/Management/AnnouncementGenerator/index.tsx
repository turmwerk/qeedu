import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FeatureRecordDialog from "@/feature/FeatureRecordDialog";
import ConfirmDialog from "@/ui/ConfirmDialog";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { announcementGeneratorAdapter } from "@/pages/Management/featureAdapters";
import { announcementGeneratorPageData } from "@/pages/Management/featureData";
import { WorkspacePageFrame } from "@/pages/shared/workbench";
import { showToast } from "@/ui/Toast";
import AssistantPanel from "./AssistantPanel";
import HeroSection from "./HeroSection";
import MainPanel from "./MainPanel";

const AnnouncementGenerator: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { announcementId } = useParams();
  const { records, createRecord, patchRecord, duplicateRecord, removeRecord } =
    useFeatureRecords(announcementGeneratorAdapter);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const createOpen = location.pathname.endsWith("/new");
  const selected = records.find((item) => item.id === announcementId) ?? records[0] ?? null;

  return (
    <>
      <WorkspacePageFrame
        header={
          <HeroSection
            headline={announcementGeneratorPageData.headline}
            description={announcementGeneratorPageData.description}
            onOpenHistory={() => navigate("/management/announcement-generator")}
            onCreate={() => navigate("/management/announcement-generator/new")}
          />
        }
        initialSplit={68}
        minSplit={52}
        maxSplit={78}
        left={
          <MainPanel
            records={records}
            selected={selected}
            onOpenRecord={(id) => navigate(`/management/announcement-generator/${id}`)}
            onDuplicate={(id) => {
              const duplicated = duplicateRecord(id);
              if (duplicated) {
                navigate(`/management/announcement-generator/${duplicated.id}`);
                showToast("已复制公告记录");
              }
            }}
            onRequestDelete={setDeleteId}
            onAppendContent={(content) => {
              if (!selected) return;
              patchRecord(selected.id, {
                content: `${selected.content}${content}`.trim(),
                updatedAt: Date.now(),
              });
            }}
          />
        }
        right={
          <AssistantPanel
            selected={selected}
            transport={selected ? announcementGeneratorAdapter.createChatTransport(selected.title) : undefined}
          />
        }
      />

      <FeatureRecordDialog
        open={createOpen}
        title="新建通知记录"
        fields={announcementGeneratorPageData.createFields}
        onClose={() => navigate("/management/announcement-generator")}
        onSubmit={(values) => {
          const created = createRecord(values);
          navigate(`/management/announcement-generator/${created.id}`);
          showToast("已创建通知记录");
        }}
        submitText="创建并进入编辑台"
      />

      <ConfirmDialog
        open={!!deleteId}
        title="删除公告记录"
        description="删除后该通知草稿和本地对话记录会一并移除。"
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            removeRecord(deleteId);
            if (announcementId === deleteId) navigate("/management/announcement-generator");
            showToast("已删除公告记录");
          }
          setDeleteId(null);
        }}
      />
    </>
  );
};

export default AnnouncementGenerator;
