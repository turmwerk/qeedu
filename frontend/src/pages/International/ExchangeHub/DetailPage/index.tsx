import React from "react";
import { WorkspaceDetailRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("international-exchange-hub");

const ExchangeHubDetailPage: React.FC = () => {
  return <WorkspaceDetailRoute config={module} />;
};

export default ExchangeHubDetailPage;

