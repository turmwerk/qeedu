import React from "react";
import { WorkspaceDetailRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("international-process-flow");

const ProcessFlowDetailPage: React.FC = () => {
  return <WorkspaceDetailRoute config={module} />;
};

export default ProcessFlowDetailPage;

