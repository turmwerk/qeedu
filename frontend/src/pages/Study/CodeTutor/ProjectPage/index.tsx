import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { WorkspaceProvider } from "./context";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import EditorArea from "./components/EditorArea";
import AssistantPanel from "./components/AssistantPanel";
import TerminalPanel from "./components/TerminalPanel";
import BottomBar from "./components/BottomBar";

const PROJECT_NAMES: Record<number, string> = {
  1: "Python 入门：变量与数据类型",
  2: "Python 进阶：控制流与函数",
  3: "数据结构：线性表与递归",
  4: "算法设计：排序与搜索",
  5: "Web 开发：HTML/CSS/JS",
  6: "面向对象编程：封装与继承",
};

const ProjectPageInner: React.FC = () => {
  const [terminalHeight, setTerminalHeight] = useState(180);
  const [terminalOpen, setTerminalOpen] = useState(true);

  return (
    <div
      className="flex h-screen w-screen flex-col overflow-hidden bg-[#1e1e1e] text-[#cccccc]"
    >
      {/* ── 顶部菜单栏 ── */}
      <TopBar />

      {/* ── 中间主区域 ── */}
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
