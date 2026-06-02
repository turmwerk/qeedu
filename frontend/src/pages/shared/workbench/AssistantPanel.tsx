import React from "react";
import ChatDialog from "@/feature/ChatDialog";
import {
  joinWorkbenchClasses,
  workbenchAssistantPanelShellClassName,
} from "./panelShell";

type ChatDialogProps = React.ComponentProps<typeof ChatDialog>;

type WorkspaceAssistantPanelProps = Pick<
  ChatDialogProps,
  "dialogId" | "botName" | "initMessage" | "seedMessages" | "transport"
> & {
  shellClassName?: string;
  innerClassName?: string;
};

const WorkspaceAssistantPanel: React.FC<WorkspaceAssistantPanelProps> = ({
  dialogId,
  botName,
  initMessage,
  seedMessages,
  transport,
  shellClassName,
  innerClassName,
}) => (
  <div className={joinWorkbenchClasses(workbenchAssistantPanelShellClassName, "chat-dialog-shell", shellClassName)}>
    <div className={joinWorkbenchClasses("flex-1 min-h-0 p-4 md:p-5", innerClassName)}>
      <ChatDialog
        dialogId={dialogId}
        botName={botName}
        initMessage={initMessage}
        seedMessages={seedMessages}
        transport={transport}
      />
    </div>
  </div>
);

export default WorkspaceAssistantPanel;
