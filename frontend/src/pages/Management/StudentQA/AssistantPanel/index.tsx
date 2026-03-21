import React from "react";
import { studentQARecords } from "@/pages/Management/featureData";
import { WorkspaceAssistantPanel } from "@/pages/shared/workbench";

type StudentQARecord = (typeof studentQARecords)[number];

type Props = {
  selected: StudentQARecord | null;
  transport?: React.ComponentProps<typeof WorkspaceAssistantPanel>["transport"];
};

const AssistantPanel: React.FC<Props> = ({ selected, transport }) =>
  selected ? (
    <WorkspaceAssistantPanel
      dialogId={`management-student-qa-${selected.id}`}
      botName="问答协同助手"
      initMessage="我已经读取当前问题、FAQ 树和回复草稿，可以继续生成建议回复、追问澄清或标准 FAQ。"
      transport={transport}
    />
  ) : (
    <WorkspaceAssistantPanel
      dialogId="management-student-qa-empty"
      botName="问答协同助手"
      initMessage="选择一条问答线程后，我可以继续帮你生成建议回复和标准 FAQ。"
    />
  );

export default AssistantPanel;
