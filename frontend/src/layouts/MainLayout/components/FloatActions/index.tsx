import React from "react";
import ThemeToggle from "./components/ThemeToggle";
import FloatingButton from "@/components/FloatingButton";
import { SettingOutlined } from "@ant-design/icons";

const FloatActions: React.FC = () => {
  // 显示常驻操作（始终显示，且靠近右下角）
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-1.5">
      {/* 主题切换：常驻显示 */}
      <ThemeToggle />

      {/* 设置按钮：常驻显示 */}
      <FloatingButton
        onClick={() => {}}
        visible={true}
        icon={<SettingOutlined style={{ fontSize: 20 }} className="animate-[spin_2s_linear_infinite] group-hover:animate-none" />}
        ariaLabel="设置"
        title="设置"
        size={40}
        shape="rounded-lg"
      />
    </div>
  );
};

export default FloatActions;
