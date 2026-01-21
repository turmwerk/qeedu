import React from "react";
import Dialog from "@/components/Dialog";

type AssistantPanelProps = {
  id?: string;
};

const AssistantPanel: React.FC<AssistantPanelProps> = ({ id }) => {
  return (
    <div className="flex-1 min-h-0 overflow-hidden p-4">
      <div className="h-full min-h-0">
        {/* 传入大纲id作为dialogId，保证唯一性 */}
        <Dialog
          key={id || "default-outline"}
          dialogId={id || "default-outline"}
          botName="大纲助手"
          initMessage="欢迎使用大纲助手，你可以询问如何改进课程大纲。"
        />
      </div>
    </div>
  );
};

export default AssistantPanel;
