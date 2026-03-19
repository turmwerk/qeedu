import React from "react";
import { WorkspaceListRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("international-matching-lab");

const MatchingLabListPage: React.FC = () => {
  return <WorkspaceListRoute config={module} />;
};

export default MatchingLabListPage;

