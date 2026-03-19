import React from "react";
import { WorkspaceDetailRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("research-paper-reader");

const PaperReaderDetailPage: React.FC = () => {
  return <WorkspaceDetailRoute config={module} />;
};

export default PaperReaderDetailPage;

