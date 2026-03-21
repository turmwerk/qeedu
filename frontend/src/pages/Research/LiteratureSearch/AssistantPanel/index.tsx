import React from "react";
import { literatureSearchRecords } from "@/pages/Research/featureData";
import { WorkspaceAssistantPanel } from "@/pages/shared/workbench";

type LiteratureSearchRecord = (typeof literatureSearchRecords)[number];

type Props = {
  selected: LiteratureSearchRecord | null;
  transport?: React.ComponentProps<typeof WorkspaceAssistantPanel>["transport"];
};

const AssistantPanel: React.FC<Props> = ({ selected, transport }) =>
  selected ? (
    <WorkspaceAssistantPanel
      dialogId={`research-literature-${selected.id}`}
      botName="检索综述助手"
      initMessage="我已经读取当前检索式、筛选条件和候选论文，可以继续帮你缩小范围、总结主题簇或输出筛选理由。"
      transport={transport}
    />
  ) : (
    <WorkspaceAssistantPanel
      dialogId="research-literature-empty"
      botName="检索综述助手"
      initMessage="选择一条检索记录后，我可以继续帮你整理检索策略和筛选理由。"
    />
  );

export default AssistantPanel;
