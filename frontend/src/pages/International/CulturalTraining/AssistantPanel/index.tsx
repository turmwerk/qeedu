import React from "react";
import { culturalTrainingRecords } from "@/pages/International/featureData";
import { WorkspaceAssistantPanel } from "@/pages/shared/workbench";

type CulturalTrainingRecord = (typeof culturalTrainingRecords)[number];

type Props = {
  selected: CulturalTrainingRecord | null;
  transport?: React.ComponentProps<typeof WorkspaceAssistantPanel>["transport"];
};

const AssistantPanel: React.FC<Props> = ({ selected, transport }) =>
  selected ? (
    <WorkspaceAssistantPanel
      dialogId={`international-culture-${selected.id}`}
      botName="跨文化适应助手"
      initMessage="我已经读取当前画像、模块进度与风险备注，可以继续生成适应建议、情境解释和安全提醒。"
      transport={transport}
    />
  ) : (
    <WorkspaceAssistantPanel
      dialogId="international-culture-empty"
      botName="跨文化适应助手"
      initMessage="选择一条培训画像后，我可以继续生成适应建议和安全提醒。"
    />
  );

export default AssistantPanel;
