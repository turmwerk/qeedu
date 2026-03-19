import React from "react";
import { WorkspaceListRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("international-pre-departure");

const PreDepartureListPage: React.FC = () => {
  return <WorkspaceListRoute config={module} />;
};

export default PreDepartureListPage;

