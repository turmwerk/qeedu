import React from "react";
import { WorkspaceDetailRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("international-abroad-life");

const AbroadLifeDetailPage: React.FC = () => {
  return <WorkspaceDetailRoute config={module} />;
};

export default AbroadLifeDetailPage;

