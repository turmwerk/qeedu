import React from "react";
import { WorkspaceListRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("international-cultural-training");

const CulturalTrainingListPage: React.FC = () => {
  return <WorkspaceListRoute config={module} />;
};

export default CulturalTrainingListPage;

