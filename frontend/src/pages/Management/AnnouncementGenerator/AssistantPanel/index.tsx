import React from "react";
import { announcementGeneratorRecords } from "@/pages/Management/featureData";
import { WorkspaceAssistantPanel } from "@/pages/shared/workbench";

type AnnouncementRecord = (typeof announcementGeneratorRecords)[number];

type Props = {
  selected: AnnouncementRecord | null;
  transport?: React.ComponentProps<typeof WorkspaceAssistantPanel>["transport"];
};

const AssistantPanel: React.FC<Props> = ({ selected, transport }) =>
  selected ? (
    <WorkspaceAssistantPanel
      dialogId={`management-announcement-${selected.id}`}
      botName="公告润色助手"
      initMessage="我已经读取当前通知背景、模板和输出渠道，可以继续润色正式通知、FAQ 或移动端短版。"
      transport={transport}
    />
  ) : (
    <WorkspaceAssistantPanel
      dialogId="management-announcement-empty"
      botName="公告润色助手"
      initMessage="选择一条公告记录后，我可以继续帮你润色正式通知和 FAQ。"
    />
  );

export default AssistantPanel;
