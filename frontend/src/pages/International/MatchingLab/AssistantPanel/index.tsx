import React from "react";
import { matchingLabRecords } from "@/pages/International/featureData";
import { WorkspaceAssistantPanel } from "@/pages/shared/workbench";

type MatchingLabRecord = (typeof matchingLabRecords)[number];

type Props = {
  selected: MatchingLabRecord | null;
  transport?: React.ComponentProps<typeof WorkspaceAssistantPanel>["transport"];
};

const AssistantPanel: React.FC<Props> = ({ selected, transport }) =>
  selected ? (
    <WorkspaceAssistantPanel
      dialogId={`international-matching-${selected.id}`}
      botName="决策分析助手"
      initMessage="我已经读取当前画像、候选排序和联动模块，可以继续解释优先级、补决策说明或输出导师沟通稿。"
      transport={transport}
    />
  ) : (
    <WorkspaceAssistantPanel
      dialogId="international-matching-empty"
      botName="决策分析助手"
      initMessage="选择一条匹配分析后，我可以继续解释排序和输出沟通稿。"
    />
  );

export default AssistantPanel;
