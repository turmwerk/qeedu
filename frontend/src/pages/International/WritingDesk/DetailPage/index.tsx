import React from "react";
import { WorkspaceDetailRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("international-writing-desk");

const WritingDeskDetailPage: React.FC = () => {
  return <WorkspaceDetailRoute config={module} />;
};

export default WritingDeskDetailPage;

