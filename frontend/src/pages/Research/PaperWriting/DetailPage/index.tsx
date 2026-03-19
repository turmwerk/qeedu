import React from "react";
import { WorkspaceDetailRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("research-paper-writing");

const PaperWritingDetailPage: React.FC = () => {
  return <WorkspaceDetailRoute config={module} />;
};

export default PaperWritingDetailPage;
