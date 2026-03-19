import React from "react";
import { WorkspaceListRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("research-paper-writing");

const PaperWritingListPage: React.FC = () => {
  return <WorkspaceListRoute config={module} />;
};

export default PaperWritingListPage;

