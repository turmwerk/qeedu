import React from "react";
import { WorkspaceListRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("international-welcome-portal");

const WelcomePortalListPage: React.FC = () => {
  return <WorkspaceListRoute config={module} />;
};

export default WelcomePortalListPage;

