import React from "react";
import {
  BranchesOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useWorkspace } from "../context";
import Dropdown, { type DropdownItem } from "@/ui/Dropdown";
import { useCompletionStore } from "@/feature/CodeEditor/CodeCompletion/completionStore";
import { CompletionMode, COMPLETION_MODE_LABELS } from "@/feature/CodeEditor/CodeCompletion/types";

const BottomBar: React.FC = () => {
  const { projectName, tabs, activeTabId } = useWorkspace();
  const { mode, setMode } = useCompletionStore();

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const displayLanguage = activeTab?.language ?? "plaintext";

  const completionItems: DropdownItem[] = Object.values(CompletionMode).map((m) => ({
    label: COMPLETION_MODE_LABELS[m],
    active: mode === m,
    onClick: () => setMode(m),
  }));

  return (
    <div className="flex h-6 w-full shrink-0 select-none items-center justify-between bg-[#007acc] px-2 text-[11px] text-white">
      {/* 左侧：分支信息 */}
      <div className="flex items-center gap-3">
        <span className="flex cursor-pointer items-center gap-1 rounded px-1 hover:bg-white/20">
          <BranchesOutlined />
          <span>main</span>
        </span>
        <span className="flex cursor-pointer items-center gap-1 rounded px-1 hover:bg-white/20">
          <CheckCircleOutlined />
          <span>0</span>
          <WarningOutlined />
          <span>0</span>
        </span>
      </div>

      {/* 中间：项目名 */}
      <span className="absolute left-1/2 -translate-x-1/2 text-[11px] opacity-80">
        {projectName}
      </span>

      {/* 右侧：语言 / 编码 / 补全模式 */}
      <div className="flex items-center gap-3">
        <span className="cursor-pointer rounded px-1 hover:bg-white/20">UTF-8</span>
        <span className="cursor-pointer rounded px-1 hover:bg-white/20">{displayLanguage}</span>
        <Dropdown
          button={
            <span className="flex items-center gap-1">
              <ThunderboltOutlined />
              <span>{COMPLETION_MODE_LABELS[mode]}</span>
            </span>
          }
          items={completionItems}
          direction="up"
          portalToBody
          showCheck
          showBorder={false}
        />
        <span className="flex cursor-pointer items-center gap-1 rounded px-1 hover:bg-white/20">
          <InfoCircleOutlined />
          <span>Code Tutor AI</span>
        </span>
      </div>
    </div>
  );
};

export default BottomBar;
