import React from "react";
import { WorkspaceAssistantPanel } from "@/pages/shared/workbench";
import type { ConferenceEntry } from "../data";

type Props = {
  conference: ConferenceEntry;
};

const AssistantPanel: React.FC<Props> = ({ conference }) => (
  <WorkspaceAssistantPanel
    dialogId={`research-conference-${conference.id}`}
    botName="投稿策略助手"
    initMessage={`我已经读取当前会议 ${conference.name} 的截止时间、待办进度和综述任务，可以继续帮你拆投稿节奏、补齐高优先事项或压缩成今日行动清单。`}
  />
);

export default AssistantPanel;
