import React from "react";
import { processAssistantRecords } from "@/pages/Management/featureData";
import { WorkspaceAssistantPanel } from "@/pages/shared/workbench";

type ProcessAssistantRecord = (typeof processAssistantRecords)[number];

type Props = {
  selected: ProcessAssistantRecord | null;
  transport?: React.ComponentProps<typeof WorkspaceAssistantPanel>["transport"];
};

const AssistantPanel: React.FC<Props> = ({ selected, transport }) =>
  selected ? (
    <WorkspaceAssistantPanel
      dialogId={`management-process-${selected.id}`}
      botName="流程纠偏助手"
      initMessage="我已经读取当前案例、步骤清单和异常信息，可以继续帮你重排步骤、生成补救动作或整理提醒。"
      transport={transport}
    />
  ) : (
    <WorkspaceAssistantPanel
      dialogId="management-process-empty"
      botName="流程纠偏助手"
      initMessage="选择一条事务案例后，我可以继续帮你重排步骤和补救动作。"
    />
  );

export default AssistantPanel;
