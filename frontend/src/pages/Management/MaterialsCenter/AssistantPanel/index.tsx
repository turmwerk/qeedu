import React from "react";
import { materialsCenterRecords } from "@/pages/Management/featureData";
import { WorkspaceAssistantPanel } from "@/pages/shared/workbench";

type MaterialsCenterRecord = (typeof materialsCenterRecords)[number];

type Props = {
  selected: MaterialsCenterRecord | null;
  transport?: React.ComponentProps<typeof WorkspaceAssistantPanel>["transport"];
};

const AssistantPanel: React.FC<Props> = ({ selected, transport }) =>
  selected ? (
    <WorkspaceAssistantPanel
      dialogId={`management-materials-${selected.id}`}
      botName="材料审核助手"
      initMessage="我已经读取当前材料集合、审核状态和模板资源，可以继续生成补件说明、审核摘要或批量提醒。"
      transport={transport}
    />
  ) : (
    <WorkspaceAssistantPanel
      dialogId="management-materials-empty"
      botName="材料审核助手"
      initMessage="选择一个材料集合后，我可以继续帮你生成补件说明和审核摘要。"
    />
  );

export default AssistantPanel;
