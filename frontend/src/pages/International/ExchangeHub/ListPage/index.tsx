import React from "react";
import { WorkspaceListRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("international-exchange-hub");

const ExchangeHubListPage: React.FC = () => {
  return <WorkspaceListRoute config={module} />;
};

export default ExchangeHubListPage;

