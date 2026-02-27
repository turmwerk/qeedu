import React from "react";
import FloatingButton from "@/components/FloatingButton";
import { SettingOutlined } from "@ant-design/icons";

const Settings: React.FC = () => {
  return (
    <FloatingButton
      onClick={() => {}}
      visible={true}
      icon={<SettingOutlined style={{ fontSize: 20 }} className="animate-[spin_2s_linear_infinite] group-hover:animate-none" />}
      ariaLabel="设置"
      title="设置"
      size={40}
      shape="rounded-lg"
      className="glass-btn"
    />
  );
};

export default Settings;
