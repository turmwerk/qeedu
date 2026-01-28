import React from "react";
import ThemeToggle from "./components/ThemeToggle";
import Settings from "./components/Settings";

const FloatActions: React.FC = () => {
  // 显示常驻操作（始终显示，且靠近右下角）
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-1.5">
      {/* 主题切换：常驻显示 */}
      <ThemeToggle />

      {/* 设置按钮：常驻显示 */}
      <Settings />
    </div>
  );
};

export default FloatActions;
