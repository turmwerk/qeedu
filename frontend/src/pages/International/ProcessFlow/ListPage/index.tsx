import React from "react";
import { WorkspaceListRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("international-process-flow");

const ProcessFlowListPage: React.FC = () => {
  return <WorkspaceListRoute config={module} />;
};

export default ProcessFlowListPage;

