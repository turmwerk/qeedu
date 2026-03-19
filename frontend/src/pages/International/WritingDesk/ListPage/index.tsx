import React from "react";
import { WorkspaceListRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("international-writing-desk");

const WritingDeskListPage: React.FC = () => {
  return <WorkspaceListRoute config={module} />;
};

export default WritingDeskListPage;

