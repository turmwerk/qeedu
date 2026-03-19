import React from "react";
import { WorkspaceDetailRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("international-pre-departure");

const PreDepartureDetailPage: React.FC = () => {
  return <WorkspaceDetailRoute config={module} />;
};

export default PreDepartureDetailPage;

