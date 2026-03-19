import React from "react";
import { QuestionCircleOutlined, SettingOutlined } from "@ant-design/icons";

interface RightActionsProps {
  onHelp: () => void;
  onSettings: () => void;
}

const RightActions: React.FC<RightActionsProps> = ({ onHelp, onSettings }) => {
  return (
    <div className="ml-auto flex items-center gap-1">
      {[
        { icon: <QuestionCircleOutlined />, title: "帮助", onClick: onHelp },
        { icon: <SettingOutlined />, title: "设置", onClick: onSettings },
      ].map(({ icon, title, onClick }) => (
        <button
          key={title}
          title={title}
          className="flex h-7 w-7 items-center justify-center rounded text-[#cccccc] opacity-70 transition hover:bg-white/10 hover:opacity-100"
          onClick={onClick}
          type="button"
        >
          <span className="text-sm">{icon}</span>
        </button>
      ))}
    </div>
  );
};

export default RightActions;
