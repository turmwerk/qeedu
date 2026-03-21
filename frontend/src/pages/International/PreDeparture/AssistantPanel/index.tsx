import React from "react";
import { preDepartureRecords } from "@/pages/International/featureData";
import { WorkspaceAssistantPanel } from "@/pages/shared/workbench";

type PreDepartureRecord = (typeof preDepartureRecords)[number];

type Props = {
  selected: PreDepartureRecord | null;
  transport?: React.ComponentProps<typeof WorkspaceAssistantPanel>["transport"];
};

const AssistantPanel: React.FC<Props> = ({ selected, transport }) =>
  selected ? (
    <WorkspaceAssistantPanel
      dialogId={`international-predeparture-${selected.id}`}
      botName="行前准备助手"
      initMessage="我已经读取当前准备清单、文件包和提醒区，可以继续输出打包清单、落地建议或风险提醒。"
      transport={transport}
    />
  ) : (
    <WorkspaceAssistantPanel
      dialogId="international-predeparture-empty"
      botName="行前准备助手"
      initMessage="选择一条行前准备记录后，我可以继续帮你整理打包清单和风险提醒。"
    />
  );

export default AssistantPanel;
