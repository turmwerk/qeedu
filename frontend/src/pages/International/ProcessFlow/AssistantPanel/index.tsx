import React from "react";
import { processFlowRecords } from "@/pages/International/featureData";
import { WorkspaceAssistantPanel } from "@/pages/shared/workbench";

type ProcessFlowRecord = (typeof processFlowRecords)[number];

type Props = {
  selected: ProcessFlowRecord | null;
  transport?: React.ComponentProps<typeof WorkspaceAssistantPanel>["transport"];
};

const AssistantPanel: React.FC<Props> = ({ selected, transport }) =>
  selected ? (
    <WorkspaceAssistantPanel
      dialogId={`international-process-${selected.id}`}
      botName="流程计划助手"
      initMessage="我已经读取当前计划、任务与里程碑，可以继续压缩三日执行计划、重排节点或生成补件提醒。"
      transport={transport}
    />
  ) : (
    <WorkspaceAssistantPanel
      dialogId="international-process-empty"
      botName="流程计划助手"
      initMessage="选择一条申请计划后，我可以继续帮你压缩执行计划和提醒策略。"
    />
  );

export default AssistantPanel;
