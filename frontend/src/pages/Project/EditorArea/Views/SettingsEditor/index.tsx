import React from "react";
import { SettingOutlined } from "@ant-design/icons";

const SettingsEditor: React.FC = () => (
  <div className="flex h-full w-full select-none flex-col items-center justify-center gap-3 bg-[#1e1e1e] text-[#9d9d9d]">
    <SettingOutlined className="text-3xl" />
    <p className="text-sm">设置（即将开放）</p>
  </div>
);

export default SettingsEditor;
