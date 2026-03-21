import React from "react";
import { welcomePortalRecords } from "@/pages/International/featureData";
import { WorkspaceAssistantPanel } from "@/pages/shared/workbench";

type WelcomePortalRecord = (typeof welcomePortalRecords)[number];

type Props = {
  selected: WelcomePortalRecord | null;
  transport?: React.ComponentProps<typeof WorkspaceAssistantPanel>["transport"];
};

const AssistantPanel: React.FC<Props> = ({ selected, transport }) =>
  selected ? (
    <WorkspaceAssistantPanel
      dialogId={`international-welcome-${selected.id}`}
      botName="来华支持助手"
      initMessage="我已经读取当前支持档案、FAQ 和待办，可以继续生成 onboarding notice、双语说明和首周支持建议。"
      transport={transport}
    />
  ) : (
    <WorkspaceAssistantPanel
      dialogId="international-welcome-empty"
      botName="来华支持助手"
      initMessage="选择一条来华支持档案后，我可以继续整理 FAQ 和 onboarding notice。"
    />
  );

export default AssistantPanel;
