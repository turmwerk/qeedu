import React from "react";
import { dashboardRecords } from "@/pages/Management/featureData";
import { WorkspaceAssistantPanel } from "@/pages/shared/workbench";

type DashboardRecord = (typeof dashboardRecords)[number];

type Props = {
  selected: DashboardRecord | null;
  transport?: React.ComponentProps<typeof WorkspaceAssistantPanel>["transport"];
};

const AssistantPanel: React.FC<Props> = ({ selected, transport }) =>
  selected ? (
    <WorkspaceAssistantPanel
      dialogId={`management-dashboard-${selected.id}`}
      botName="数据洞察助手"
      initMessage="我已经读取当前指标、趋势和告警流，可以继续输出本周洞察、例会摘要或下周行动建议。"
      transport={transport}
    />
  ) : (
    <WorkspaceAssistantPanel
      dialogId="management-dashboard-empty"
      botName="数据洞察助手"
      initMessage="选择一个洞察会话后，我可以继续帮你整理摘要和行动建议。"
    />
  );

export default AssistantPanel;
