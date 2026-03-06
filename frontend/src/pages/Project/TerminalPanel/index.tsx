import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CloseOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import TabBar from "@/ui/TabBar";

interface TerminalPanelProps {
  height: number;
  onHeightChange: (h: number) => void;
  onClose: () => void;
}

const MIN_HEIGHT = 80;
const MAX_HEIGHT = 600;

const TerminalPanel: React.FC<TerminalPanelProps> = ({
  height,
  onHeightChange,
  onClose,
}) => {
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startH = useRef(0);
  const [lines] = useState([
    "$ python3 src/main.py",
    "Hello, Code Tutor!",
    "$ ",
  ]);

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

  return (
    <div
      className="flex flex-col border-t border-[#3c3c3c] bg-[#1e1e1e]"
      style={{ height }}
    >
      {/* 可拖拽把手 */}
      <div
        className="h-1 w-full cursor-row-resize bg-transparent hover:bg-[#007acc]/40"
        onMouseDown={onMouseDown}
      />
      <TabBar
        height="h-8"
        tabs={[{ id: "terminal", label: "TERMINAL" }, { id: "output", label: "OUTPUT" }]}
        activeId="terminal"
        tools={[
          { icon: <PlusOutlined />, title: "新建终端" },
          { icon: <MinusOutlined />, title: "最小化" },
          { icon: <CloseOutlined />, title: "关闭终端", onClick: onClose },
        ]}
      />
      <div className="flex-1 overflow-y-auto px-3 py-2 font-mono text-xs text-[#cccccc]">
        {lines.map((line, i) => (
          <div key={i} className="leading-5">
            {line.startsWith("$") ? (
              <span>
                <span className="text-[#4ec9b0]">$</span>
                <span>{line.slice(1)}</span>
              </span>
            ) : (
              <span className="text-[#9cdcfe]">{line}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TerminalPanel;
