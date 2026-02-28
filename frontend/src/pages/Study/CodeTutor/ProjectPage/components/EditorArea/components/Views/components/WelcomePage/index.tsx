import React from "react";
import { CodeOutlined } from "@ant-design/icons";

const SHORTCUTS = [
  { key: "Ctrl + P", desc: "快速打开文件" },
  { key: "Ctrl + Shift + P", desc: "命令面板" },
  { key: "Ctrl + `", desc: "切换终端" },
  { key: "Ctrl + B", desc: "切换侧边栏" },
  { key: "Ctrl + /", desc: "注释/取消注释" },
];

const WelcomePage: React.FC = () => (
  <div className="flex h-full w-full select-none flex-col items-center justify-center gap-6 bg-[#1e1e1e] text-[#9d9d9d]">
    {/* Logo */}
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#007acc]/20 text-4xl text-[#007acc]">
        <CodeOutlined />
      </div>
      <h2 className="m-0 text-xl font-light tracking-wide text-[#cccccc]">
        Code Tutor
      </h2>
      <p className="text-xs opacity-70">AI 辅助在线编程环境</p>
    </div>

    {/* 快捷键提示 */}
    <div className="w-72">
      <p className="mb-3 text-center text-xs uppercase tracking-wider opacity-50">
        快捷键
      </p>
      <div className="flex flex-col gap-2">
        {SHORTCUTS.map(({ key, desc }) => (
          <div key={key} className="flex items-center justify-between text-xs">
            <span className="rounded border border-[#3c3c3c] bg-[#2d2d2d] px-2 py-0.5 font-mono text-[10px]">
              {key}
            </span>
            <span className="text-[#7d7d7d]">{desc}</span>
          </div>
        ))}
      </div>
    </div>

    <p className="text-[11px] opacity-40">
      点击左侧文件树中的文件开始编程
    </p>
  </div>
);

export default WelcomePage;
