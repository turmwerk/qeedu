import React from "react";
import { WorkspaceListRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("international-abroad-life");

const AbroadLifeListPage: React.FC = () => {
  return <WorkspaceListRoute config={module} />;
};

export default AbroadLifeListPage;

