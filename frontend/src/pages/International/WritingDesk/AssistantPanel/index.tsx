import React from "react";
import { writingDeskRecords } from "@/pages/International/featureData";
import { WorkspaceAssistantPanel } from "@/pages/shared/workbench";

type WritingDeskRecord = (typeof writingDeskRecords)[number];

type Props = {
  selected: WritingDeskRecord | null;
  transport?: React.ComponentProps<typeof WorkspaceAssistantPanel>["transport"];
};

const AssistantPanel: React.FC<Props> = ({ selected, transport }) =>
  selected ? (
    <WorkspaceAssistantPanel
      dialogId={`international-writing-${selected.id}`}
      botName="双语写作助手"
      initMessage="我已经读取当前沟通场景、双语草稿和模板，可以继续润色 opening、生成中英对照或补发送前检查。"
      transport={transport}
    />
  ) : (
    <WorkspaceAssistantPanel
      dialogId="international-writing-empty"
      botName="双语写作助手"
      initMessage="选择一份沟通草稿后，我可以继续帮你做双语润色和发送前检查。"
    />
  );

export default AssistantPanel;
