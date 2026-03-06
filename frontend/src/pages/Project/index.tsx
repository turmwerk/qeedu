import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { WorkspaceProvider } from "./context";
import { PROJECT_NAMES } from "./data/projectNames";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import EditorArea from "./EditorArea";
import AssistantPanel from "./AssistantPanel";
import TerminalPanel from "./TerminalPanel";
import BottomBar from "./BottomBar";

const ProjectPageInner: React.FC = () => {
  const [terminalHeight, setTerminalHeight] = useState(180);
  const [terminalOpen, setTerminalOpen] = useState(true);

  return (
    <div
      className="project-page-root flex h-screen w-screen flex-col overflow-hidden bg-[#1e1e1e] text-[#cccccc]"
    >
      {/* 顶部菜单栏 */}
      <TopBar />

      {/* 中间主区域 */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* 左侧 Sidebar（ActivityBar + Panel） */}
        <Sidebar />

        {/* 主编辑区 + 终端 */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* 编辑器区域 */}
          <div
            className="min-h-0 flex-1 overflow-hidden"
            style={{
              height: terminalOpen
                ? `calc(100% - ${terminalHeight}px)`
                : "100%",
            }}
          >
            <EditorArea />
          </div>

          {/* 可拖拽终端 */}
          {terminalOpen && (
            <TerminalPanel
              height={terminalHeight}
              onHeightChange={setTerminalHeight}
              onClose={() => setTerminalOpen(false)}
            />
          )}
        </div>

        {/* 右侧 AI 助手 */}
        <AssistantPanel />
      </div>

      {/* ── 底部状态栏 ── */}
      <BottomBar />
    </div>
  );
};

const ProjectPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const proId = Number(searchParams.get("proId") ?? "1");
  const projectName = PROJECT_NAMES[proId] ?? `项目 ${proId}`;

  return (
    <WorkspaceProvider projectName={projectName}>
      <ProjectPageInner />
    </WorkspaceProvider>
  );
};

export default ProjectPage;
