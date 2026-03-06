import React from "react";
import Dialog from "@/feature/ChatDialog";

type AssistantPanelProps = {
  id?: string;
};

const AssistantPanel: React.FC<AssistantPanelProps> = ({ id }) => {
  return (
    <div className="flex-1 min-h-0 overflow-hidden p-4 rounded-xl bg-white/[0.88] dark:bg-white/[0.28] border-0 dark:border dark:border-white/[0.28] shadow-[0_8px_30px_rgba(120,90,200,0.14),inset_0_1px_0_rgba(255,255,255,0.74),inset_0_-1px_0_rgba(255,255,255,0.34)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(255,255,255,0.12)] backdrop-blur-[40px] backdrop-saturate-[210%]">
      <div className="h-full min-h-0">
        {/* 传入大纲 id 作为 dialogId，保证唯一性 */}
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
