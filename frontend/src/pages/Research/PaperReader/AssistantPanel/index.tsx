import React from "react";
import { paperReaderRecords } from "@/pages/Research/featureData";
import { WorkspaceAssistantPanel } from "@/pages/shared/workbench";

type PaperReaderRecord = (typeof paperReaderRecords)[number];

type Props = {
  selected: PaperReaderRecord | null;
  transport?: React.ComponentProps<typeof WorkspaceAssistantPanel>["transport"];
};

const AssistantPanel: React.FC<Props> = ({ selected, transport }) =>
  selected ? (
    <WorkspaceAssistantPanel
      dialogId={`research-reader-${selected.id}`}
      botName="精读协同助手"
      initMessage="我已经读取当前论文、结构化阅读卡和证据位置，可以继续帮你做 comparative narrative、复现清单和写作移交。"
      transport={transport}
    />
  ) : (
    <WorkspaceAssistantPanel
      dialogId="research-reader-empty"
      botName="精读协同助手"
      initMessage="选择一篇论文后，我可以继续帮你组织精读结论和写作移交。"
    />
  );

export default AssistantPanel;
