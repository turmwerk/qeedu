import React from "react";
import { WorkspaceListRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("research-paper-reader");

const PaperReaderListPage: React.FC = () => {
  return <WorkspaceListRoute config={module} />;
};

export default PaperReaderListPage;

