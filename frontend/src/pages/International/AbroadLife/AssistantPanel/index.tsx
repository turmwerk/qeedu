import React from "react";
import { abroadLifeRecords } from "@/pages/International/featureData";
import { WorkspaceAssistantPanel } from "@/pages/shared/workbench";

type AbroadLifeRecord = (typeof abroadLifeRecords)[number];

type Props = {
  selected: AbroadLifeRecord | null;
  transport?: React.ComponentProps<typeof WorkspaceAssistantPanel>["transport"];
};

const AssistantPanel: React.FC<Props> = ({ selected, transport }) =>
  selected ? (
    <WorkspaceAssistantPanel
      dialogId={`international-abroad-${selected.id}`}
      botName="在外支持助手"
      initMessage="我已经读取当前支持工单、应急卡和生活指南，可以继续给出课程调整、住宿续约、证件遗失和夜间应急建议。"
      transport={transport}
    />
  ) : (
    <WorkspaceAssistantPanel
      dialogId="international-abroad-empty"
      botName="在外支持助手"
      initMessage="选择一条在外支持工单后，我可以继续帮你整理课程、住房和应急建议。"
    />
  );

export default AssistantPanel;
