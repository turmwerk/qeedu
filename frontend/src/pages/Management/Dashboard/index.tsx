import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFeatureRecords } from "@/hooks/useFeatureRecords";
import { dashboardAdapter } from "@/pages/Management/featureAdapters";
import { dashboardPageData } from "@/pages/Management/featureData";
import { WorkspacePageFrame } from "@/pages/shared/workbench";
import { showToast } from "@/ui/Toast";
import AssistantPanel from "./AssistantPanel";
import HeroSection from "./HeroSection";
import MainPanel from "./MainPanel";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { records, patchRecord } = useFeatureRecords(dashboardAdapter);
  const selected = records.find((record) => record.id === sessionId) ?? records[0] ?? null;

  return (
    <WorkspacePageFrame
      header={
        <HeroSection
          headline={dashboardPageData.headline}
          description={dashboardPageData.description}
          metrics={dashboardPageData.metrics}
        />
      }
      initialSplit={62}
      minSplit={46}
      maxSplit={74}
      left={
        <MainPanel
          records={records}
          selected={selected}
          onOpenRecord={(id) => navigate(`/management/dashboard/insights/${id}`)}
          onRefreshInsight={() => {
            if (!selected) return;
            patchRecord(selected.id, {
              content: `${selected.content}\n\n- 已追加本周洞察更新`,
              updatedAt: Date.now(),
            });
            showToast("已刷新洞察");
          }}
        />
      }
      right={
        <AssistantPanel
          selected={selected}
          transport={selected ? dashboardAdapter.createChatTransport(selected.title) : undefined}
        />
      }
    />
  );
};

export default Dashboard;
