import React, { useCallback, useEffect, useRef, useState } from "react";
import { CloseOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import TabBar from "@/ui/TabBar";
import { useContextMenu, type ContextMenuItem } from "@/ui/ContextMenu";
import TerminalView from "./Views/TerminalView";
import OutputView from "./Views/OutputView";
import ProblemsView from "./Views/ProblemsView";
import ConsoleView from "./Views/ConsoleView";

interface TerminalPanelProps {
  height: number;
  onHeightChange: (h: number) => void;
  onClose: () => void;
}

const MIN_HEIGHT = 80;
const MAX_HEIGHT = 600;

const panelTabs = [
  { id: "terminal", label: "TERMINAL" },
  { id: "output", label: "OUTPUT" },
  { id: "problems", label: "PROBLEMS" },
  { id: "console", label: "DEBUG CONSOLE" },
];

const TerminalPanel: React.FC<TerminalPanelProps> = ({
  height,
  onHeightChange,
  onClose,
}) => {
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startH = useRef(0);
  const [activePanelId, setActivePanelId] = useState("terminal");
  const [createSignal, setCreateSignal] = useState(0);
  const { openAtEvent } = useContextMenu();

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      startY.current = e.clientY;
      startH.current = height;
    },
    [height],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = startY.current - e.clientY;
      const next = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, startH.current + delta));
      onHeightChange(next);
    };
    const onUp = () => {
      isDragging.current = false;
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [onHeightChange]);

  const handlePanelContextMenu = (id: string, event: React.MouseEvent) => {
    void id;
    const items: ContextMenuItem[] = [
      { label: "Hide Panel", onClick: onClose },
      { type: "separator" },
      ...panelTabs.map((tab) => ({
        label: tab.label,
        checked: tab.id === activePanelId,
        onClick: () => setActivePanelId(tab.id),
      })),
    ];
    openAtEvent(event, items);
  };

  const handleCreateTerminal = () => {
    setActivePanelId("terminal");
    setCreateSignal((prev) => prev + 1);
  };

  return (
    <div
      className="flex flex-col border-t border-[#3c3c3c] bg-[#1e1e1e]"
      style={{ height }}
    >
      <div
        className="h-1 w-full cursor-row-resize bg-transparent hover:bg-[#007acc]/40"
        onMouseDown={onMouseDown}
      />
      <TabBar
        height="h-8"
        tabs={panelTabs}
        activeId={activePanelId}
        onTabClick={setActivePanelId}
        onTabContextMenu={handlePanelContextMenu}
        tools={[
          { icon: <PlusOutlined />, title: "New Terminal", onClick: handleCreateTerminal },
          { icon: <MinusOutlined />, title: "Minimize", onClick: () => onHeightChange(MIN_HEIGHT) },
          { icon: <CloseOutlined />, title: "Close Panel", onClick: onClose },
        ]}
      />
      <div className="min-h-0 flex-1 overflow-hidden">
        {activePanelId === "terminal" && (
          <TerminalView createSignal={createSignal} />
        )}
        {activePanelId === "output" && <OutputView />}
        {activePanelId === "problems" && <ProblemsView />}
        {activePanelId === "console" && <ConsoleView />}
      </div>
    </div>
  );
};

export default TerminalPanel;
