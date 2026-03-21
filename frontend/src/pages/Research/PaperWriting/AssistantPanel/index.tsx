import React from "react";
import { paperWritingRecords } from "@/pages/Research/featureData";
import { WorkspaceAssistantPanel } from "@/pages/shared/workbench";

type PaperWritingRecord = (typeof paperWritingRecords)[number];

type Props = {
  selected: PaperWritingRecord | null;
  transport?: React.ComponentProps<typeof WorkspaceAssistantPanel>["transport"];
};

const AssistantPanel: React.FC<Props> = ({ selected, transport }) =>
  selected ? (
    <WorkspaceAssistantPanel
      dialogId={`research-writing-${selected.id}`}
      botName="写作协同助手"
      initMessage="我已经读取当前章节树、正文草稿、模板和里程碑，可以继续压缩摘要、组织 related work 或做投稿前终检。"
      transport={transport}
    />
  ) : (
    <WorkspaceAssistantPanel
      dialogId="research-writing-empty"
      botName="写作协同助手"
      initMessage="选择一份草稿后，我可以继续帮你推进章节写作和投稿前收口。"
    />
  );

export default AssistantPanel;
