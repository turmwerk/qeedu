import React from "react";
import { exchangeHubRecords } from "@/pages/International/featureData";
import { WorkspaceAssistantPanel } from "@/pages/shared/workbench";

type ExchangeHubRecord = (typeof exchangeHubRecords)[number];

type Props = {
  selected: ExchangeHubRecord | null;
  transport?: React.ComponentProps<typeof WorkspaceAssistantPanel>["transport"];
};

const AssistantPanel: React.FC<Props> = ({ selected, transport }) =>
  selected ? (
    <WorkspaceAssistantPanel
      dialogId={`international-exchange-${selected.id}`}
      botName="项目助手"
      initMessage="我已经读取当前项目摘要、时间线和上下游联动模块，可以继续帮你比较门槛、生成纪要或衔接流程。"
      transport={transport}
    />
  ) : (
    <WorkspaceAssistantPanel
      dialogId="international-exchange-empty"
      botName="项目助手"
      initMessage="选择一个项目后，我可以继续帮你比较门槛和衔接申请流程。"
    />
  );

export default AssistantPanel;
