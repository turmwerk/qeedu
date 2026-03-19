import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button
      className="mr-2 flex h-7 w-7 items-center justify-center rounded text-[#cccccc] opacity-70 transition hover:bg-white/10 hover:opacity-100"
      title="返回项目列表"
      onClick={onClick}
      type="button"
    >
      <ArrowLeftOutlined className="text-xs" />
    </button>
  );
};

export default BackButton;
