import React from "react";
import { WorkspaceDetailRoute } from "@/feature/RecordWorkspace";
import { getWorkspaceModule } from "@/pages/workspaceRegistry";

const module = getWorkspaceModule("international-cultural-training");

const CulturalTrainingDetailPage: React.FC = () => {
  return <WorkspaceDetailRoute config={module} />;
};

export default CulturalTrainingDetailPage;

