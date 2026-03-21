import React from "react";
import { timelineRecords } from "@/pages/Management/featureData";
import { WorkspaceAssistantPanel } from "@/pages/shared/workbench";

type TimelineRecord = (typeof timelineRecords)[number];

type Props = {
  selected: TimelineRecord | null;
  transport?: React.ComponentProps<typeof WorkspaceAssistantPanel>["transport"];
};

const AssistantPanel: React.FC<Props> = ({ selected, transport }) =>
  selected ? (
    <WorkspaceAssistantPanel
      dialogId={`management-timeline-${selected.id}`}
      botName="排期助手"
      initMessage="我已经读取当前时间轴、里程碑和冲突信息，可以继续重排节点、生成提醒策略或压缩未来三天计划。"
      transport={transport}
    />
  ) : (
    <WorkspaceAssistantPanel
      dialogId="management-timeline-empty"
      botName="排期助手"
      initMessage="选择一个时间轴后，我可以继续帮你重排节点和提醒策略。"
    />
  );

export default AssistantPanel;
