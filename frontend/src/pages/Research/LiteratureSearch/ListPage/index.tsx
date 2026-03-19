import React from "react";
import { WorkspaceListRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("research-literature-search");

const LiteratureSearchListPage: React.FC = () => {
  return <WorkspaceListRoute config={module} />;
};

export default LiteratureSearchListPage;

