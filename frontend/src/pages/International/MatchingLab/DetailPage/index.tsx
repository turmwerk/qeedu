import React from "react";
import { WorkspaceDetailRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("international-matching-lab");

const MatchingLabDetailPage: React.FC = () => {
  return <WorkspaceDetailRoute config={module} />;
};

export default MatchingLabDetailPage;

