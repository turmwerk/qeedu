import React from "react";
import { WorkspaceDetailRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("research-literature-search");

const LiteratureSearchDetailPage: React.FC = () => {
  return <WorkspaceDetailRoute config={module} />;
};

export default LiteratureSearchDetailPage;

