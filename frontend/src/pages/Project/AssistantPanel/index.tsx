import React, { useState } from "react";
import { RobotOutlined, CloseOutlined, DoubleRightOutlined } from "@ant-design/icons";
import Dialog from "@/feature/ChatDialog";
import { buildAssistantDialogId, buildAssistantIntro } from "../data/assistant";
import { useWorkspace } from "../context";

const AssistantPanel: React.FC = () => {
  const { projectName, activeTabId } = useWorkspace();
  const [collapsed, setCollapsed] = useState(false);

  const dialogId = buildAssistantDialogId(projectName);
  const initMsg = buildAssistantIntro(projectName);

  if (collapsed) {
    return (
      <div className="flex shrink-0 flex-col items-center border-l border-[#3c3c3c] bg-[#252526] py-2">
        <button
          className="flex h-8 w-8 items-center justify-center rounded text-[#858585] transition hover:bg-white/10 hover:text-[#cccccc]"
          title="展开 AI 助手"
          onClick={() => setCollapsed(false)}
        >
          <DoubleRightOutlined className="rotate-180 text-xs" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex w-[340px] min-w-[280px] shrink-0 flex-col overflow-hidden border-l border-[#3c3c3c] bg-[#252526]"
    >
      {/* 标题栏 */}
      <div className="flex h-9 shrink-0 select-none items-center justify-between border-b border-[#3c3c3c] px-3">
        <div className="flex items-center gap-2 text-xs text-[#cccccc]">
          <RobotOutlined className="text-[#007acc]" />
          <span className="font-medium">AI 编程助手</span>
        </div>
        <div className="flex items-center gap-1">
          {activeTabId && (
            <span className="max-w-[100px] truncate rounded bg-[#007acc]/15 px-1.5 py-0.5 text-[10px] text-[#007acc]">
              {activeTabId.split("/").pop()}
            </span>
          )}
          <button
            className="flex h-6 w-6 items-center justify-center rounded text-[#858585] transition hover:bg-white/10 hover:text-[#cccccc]"
            title="折叠助手面板"
            onClick={() => setCollapsed(true)}
          >
            <CloseOutlined className="text-[10px]" />
          </button>
        </div>
      </div>

      {/* 对话区 */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <Dialog
          dialogId={dialogId}
          botName="Code Tutor AI"
          initMessage={initMsg}
        />
      </div>
    </div>
  );
};

export default AssistantPanel;
