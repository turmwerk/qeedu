import React from "react";
import { WorkspaceDetailRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("international-return-service");

const ReturnServiceDetailPage: React.FC = () => {
  return <WorkspaceDetailRoute config={module} />;
};

export default ReturnServiceDetailPage;

