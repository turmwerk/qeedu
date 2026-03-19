import React, { useRef, useState } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { WorkspaceProvider } from "./context";
import { PROJECT_NAMES } from "./data/projectNames";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import EditorArea from "./EditorArea";
import AssistantPanel from "./AssistantPanel";
import TerminalPanel from "./TerminalPanel";
import BottomBar from "./BottomBar";
import { ContextMenuProvider } from "@/ui/ContextMenu";
import QuickOpen from "./QuickOpen";
import {
  Group as PanelGroup,
  Panel,
  Separator as PanelResizeHandle,
  type PanelImperativeHandle,
} from "react-resizable-panels";
import ProjectShortcuts from "./Shortcuts";
import { useProjectCommands } from "./Shortcuts/commands";
import { SidebarViewProvider } from "./Sidebar/SidebarViewContext";

const ProjectPageInner: React.FC = () => {
  const terminalPanelRef = useRef<PanelImperativeHandle | null>(null);
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false);

  const handleTerminalClose = () => {
    terminalPanelRef.current?.collapse();
    setIsTerminalCollapsed(true);
  };

  const handleTerminalMinimize = () => {
    terminalPanelRef.current?.resize("140px");
    setIsTerminalCollapsed(false);
  };

  const toggleTerminalPanel = () => {
    if (!terminalPanelRef.current) return;
    if (isTerminalCollapsed) {
      terminalPanelRef.current.resize("30%");
      setIsTerminalCollapsed(false);
      return;
    }
    terminalPanelRef.current.collapse();
    setIsTerminalCollapsed(true);
  };

  const commandBundle = useProjectCommands({ toggleTerminalPanel });

  return (
    <div className="project-page-root relative flex h-screen w-screen flex-col overflow-hidden bg-[#1e1e1e] text-[#cccccc]">
      {/* 顶部菜单栏 */}
      <ProjectShortcuts commands={commandBundle.commands} />
      <TopBar commands={commandBundle.commands} state={commandBundle.state} />

      {/* 主工作区（左侧栏 + 编辑器/终端 + 右侧助手） */}
      <PanelGroup
        orientation="horizontal"
        className="flex min-h-0 flex-1 overflow-hidden"
      >
        <Panel defaultSize="18%" minSize="200px" collapsible className="min-w-0">
          <div className="h-full min-w-0">
            <Sidebar />
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 cursor-col-resize bg-[#2a2d2e] hover:bg-[#007acc]/40" />

        <Panel defaultSize="64%" minSize="320px" className="min-w-0">
          <PanelGroup
            orientation="vertical"
            className="flex h-full min-h-0 overflow-hidden"
          >
            <Panel defaultSize="70%" minSize="200px" className="min-h-0">
              <div className="h-full min-h-0">
                <EditorArea />
              </div>
            </Panel>

            <PanelResizeHandle className="h-1 cursor-row-resize bg-[#2a2d2e] hover:bg-[#007acc]/40" />

            <Panel
              panelRef={terminalPanelRef}
              collapsible
              collapsedSize="0px"
              defaultSize="30%"
              minSize="120px"
              className="min-h-0"
            >
              <div className="h-full min-h-0">
                <TerminalPanel
                  onClose={handleTerminalClose}
                  onMinimize={handleTerminalMinimize}
                />
              </div>
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle className="w-1 cursor-col-resize bg-[#2a2d2e] hover:bg-[#007acc]/40" />

        <Panel defaultSize="18%" minSize="240px" collapsible className="min-w-0">
          <div className="h-full min-w-0">
            <AssistantPanel />
          </div>
        </Panel>
      </PanelGroup>

      {/* 底部状态栏 */}
      <BottomBar />

      <QuickOpen />
    </div>
  );
};

const ProjectPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const proId = Number(searchParams.get("proId") ?? "1");
  const projectName = PROJECT_NAMES[proId] ?? `项目 ${proId}`;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <WorkspaceProvider projectName={projectName}>
      <ContextMenuProvider>
        <SidebarViewProvider>
          <ProjectPageInner />
        </SidebarViewProvider>
      </ContextMenuProvider>
    </WorkspaceProvider>
  );
};

export default ProjectPage;
