import React, { type ComponentProps } from "react";
import ChatDialog from "@/feature/ChatDialog";
import { assignmentReviewAssistantPanelShellClassName } from "../panelShell";

type Props = {
  dialogId: string;
  botName: string;
  initMessage: string;
  transport: ComponentProps<typeof ChatDialog>["transport"];
};

const AssignmentReviewAssistantPanel: React.FC<Props> = ({
  dialogId,
  botName,
  initMessage,
  transport,
}) => {
  return (
    <div className={`${assignmentReviewAssistantPanelShellClassName} p-4`}>
      <div className="flex flex-1 min-h-0 min-w-0 flex-col">
        <ChatDialog
          dialogId={dialogId}
          botName={botName}
          initMessage={initMessage}
          transport={transport}
        />
      </div>
    </div>
  );
};

export default AssignmentReviewAssistantPanel;
