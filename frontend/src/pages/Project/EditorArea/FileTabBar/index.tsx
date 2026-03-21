import React, { useCallback, useState } from "react";
import {
  SplitCellsOutlined,
  EllipsisOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { runCode } from "@/api/sandbox";
import TabBar, { type TabBarProps } from "@/ui/TabBar";
import { useContextMenu, type ContextMenuItem } from "@/ui/ContextMenu";
import { getFileIcon } from "../../utils/filePresentation";
import { useWorkspace } from "../../context";
import { isRunnableLanguage } from "../../data/languageSupport";
import { useTerminalPanelViewStore } from "../../TerminalPanel/viewStore";
import { type TabItem } from "../types";

const FileTabBar: React.FC = () => {
  const {
    workspaceKey,
    tabs,
    activeTabId,
    closeTab,
    closeOtherTabs,
    closeTabsToRight,
    closeSavedTabs,
    closeAllTabs,
    setActiveTabId,
    setRunOutput,
  } = useWorkspace();
  const { openAtEvent } = useContextMenu();
  const [running, setRunning] = useState(false);

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? null;
  const isRunnable = isRunnableLanguage(activeTab?.language);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleTabContextMenu = (id: string, event: React.MouseEvent) => {
    const index = tabs.findIndex((t) => t.id === id);
    const hasRight = index >= 0 && index < tabs.length - 1;
    const canCloseOthers = tabs.length > 1;
    const canCloseSaved = tabs.some((t) => !t.isDirty);
    const items: ContextMenuItem[] = [
      { label: "关闭", onClick: () => closeTab(id) },
      {
        label: "关闭其他",
        onClick: () => closeOtherTabs(id),
        disabled: !canCloseOthers,
      },
      {
        label: "关闭右侧",
        onClick: () => closeTabsToRight(id),
        disabled: !hasRight,
      },
      {
        label: "关闭已保存",
        onClick: () => closeSavedTabs(),
        disabled: !canCloseSaved,
      },
      { type: "separator" },
      { label: "关闭全部", onClick: () => closeAllTabs() },
      { type: "separator" },
      { label: "复制路径", onClick: () => copyText(id) },
      {
        label: "复制相对路径",
        onClick: () => copyText(id.replace(/^\//, "")),
      },
    ];
    openAtEvent(event, items);
  };

  const handleRun = useCallback(async () => {
    if (!activeTab || !isRunnable || running) return;
    if (!activeTab.content || !activeTab.language) return;
    useTerminalPanelViewStore.getState().showOutput();
    setRunOutput({
      stdout: "",
      stderr: "",
      exitCode: 0,
      executionMs: 0,
      error: "",
      timestamp: Date.now(),
      status: "running",
      language: activeTab.language,
      filePath: activeTab.id,
      fileName: activeTab.title,
    });
    setRunning(true);
    try {
      const resp = await runCode({
        language: activeTab.language,
        code: activeTab.content,
        timeout_seconds: 15,
        workspace_key: workspaceKey,
      });
      setRunOutput({
        stdout: resp.stdout,
        stderr: resp.stderr,
        exitCode: resp.exit_code,
        executionMs: resp.execution_ms,
        error: resp.error,
        timestamp: Date.now(),
        status: "completed",
        language: activeTab.language,
        filePath: activeTab.id,
        fileName: activeTab.title,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "未知错误";
      setRunOutput({
        stdout: "",
        stderr: "",
        exitCode: -1,
        executionMs: 0,
        error: message,
        timestamp: Date.now(),
        status: "completed",
        language: activeTab.language,
        filePath: activeTab.id,
        fileName: activeTab.title,
      });
    } finally {
      setRunning(false);
    }
  }, [activeTab, isRunnable, running, setRunOutput, workspaceKey]);

  const tabBarProps: TabBarProps = {
    tabs: tabs.map((t: TabItem) => ({
      id: t.id,
      label: t.title,
      isDirty: t.isDirty,
      icon: (
        <span className="text-sm">{getFileIcon(t.title, "h-3.5 w-3.5")}</span>
      ),
    })),
    activeId: activeTabId ?? undefined,
    onTabClick: setActiveTabId,
    onTabClose: closeTab,
    onTabContextMenu: handleTabContextMenu,
    tools: [
      ...(isRunnable
        ? [
            {
              icon: (
                <span className="flex items-center justify-center text-white">
                  {running ? (
                    <LoadingOutlined className="text-[18px]" />
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M8 6.5L17 12L8 17.5V6.5Z"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              ),
              title: running ? "运行中" : "运行代码",
              onClick: handleRun,
              className:
                "h-7 w-9 text-white bg-[#2ea043] hover:bg-[#3fb950] disabled:opacity-50",
              disabled: running,
            },
          ]
        : []),
      { icon: <SplitCellsOutlined />, title: "拆分编辑器" },
      { icon: <EllipsisOutlined />, title: "更多操作" },
    ],
  };

  return <TabBar {...tabBarProps} />;
};

export default FileTabBar;
