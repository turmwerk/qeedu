import React from "react";
import ThemeToggle from "./ThemeToggle";
import Settings from "./Settings";

const FloatActions: React.FC = () => {
  // 显示常驻操作（始终显示，且靠近右下角�?
  return (
    <div className="hidden sm:flex fixed bottom-1 right-1 sm:bottom-4 sm:right-4 z-50 flex-col gap-0.5 sm:gap-1.5">
      {/* 主题切换：常驻显�?*/}
      <ThemeToggle />

      {/* 设置按钮：常驻显�?*/}
      <Settings />
    </div>
  );
};

export default FloatActions;
