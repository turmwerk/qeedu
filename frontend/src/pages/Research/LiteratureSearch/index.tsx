import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FeatureRecordDialog from "@/feature/FeatureRecordDialog";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { literatureSearchAdapter } from "@/pages/Research/featureAdapters";
import {
  literatureSearchPageData,
  literatureSearchQuickActions,
} from "@/pages/Research/featureData";
import { WorkspacePageFrame } from "@/pages/shared/workbench";
import { showToast } from "@/ui/Toast";
import AssistantPanel from "./AssistantPanel";
import HeroSection from "./HeroSection";
import MainPanel from "./MainPanel";

const LiteratureSearch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { queryId } = useParams();
  const { records, createRecord, patchRecord } = useFeatureRecords(literatureSearchAdapter);
  const createOpen = location.pathname.endsWith("/new");
  const selected = records.find((record) => record.id === queryId) ?? records[0] ?? null;

  return (
    <>
      <WorkspacePageFrame
        header={
          <HeroSection
            headline={literatureSearchPageData.headline}
            description={literatureSearchPageData.description}
            selectedTitle={selected?.title}
            onCreate={() => navigate("/research/literature-search/queries/new")}
          />
        }
        initialSplit={64}
        minSplit={48}
        maxSplit={76}
        left={
          <MainPanel
            records={records}
            selected={selected}
            quickActions={literatureSearchQuickActions}
            onOpenRecord={(recordId) => navigate(`/research/literature-search/queries/${recordId}`)}
            onOpenReader={() => navigate("/research/paper-reader")}
            onAppendContent={(content) => {
              if (!selected) return;
              patchRecord(selected.id, {
                content: `${selected.content}\n\n${content}`.trim(),
                updatedAt: Date.now(),
              });
              showToast("已写入当前查询记录");
            }}
          />
        }
        right={
          <AssistantPanel
            selected={selected}
            transport={
              selected
                ? literatureSearchAdapter.createChatTransport(selected.title)
                : undefined
            }
          />
        }
      />

      <FeatureRecordDialog
        open={createOpen}
        title="新建检索查询"
        fields={literatureSearchPageData.createFields}
        onClose={() => navigate("/research/literature-search")}
        onSubmit={(values) => {
          const created = createRecord(values);
          navigate(`/research/literature-search/queries/${created.id}`);
          showToast("已创建检索查询");
        }}
      />
    </>
  );
};

export default LiteratureSearch;
