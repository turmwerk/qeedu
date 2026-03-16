import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  SearchOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { TOP_BAR_MENU_ITEMS } from "../data/topBar";
import { useWorkspace } from "../context";

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectName } = useWorkspace();
  const from =
    typeof (location.state as { from?: unknown } | null)?.from === "string"
      ? ((location.state as { from: string }).from as string)
      : undefined;

  const handleBack = () => {
    if (from && from.startsWith("/")) {
      navigate(from);
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/study/code-tutor/ListPage", { replace: true });
  };

  return (
    <div className="flex h-9 w-full shrink-0 select-none items-center bg-[#323233] px-2">
      {/* 返回按钮 */}
      <button
        className="mr-2 flex h-7 w-7 items-center justify-center rounded text-[#cccccc] opacity-70 transition hover:bg-white/10 hover:opacity-100"
        title="返回项目列表"
        onClick={handleBack}
      >
        <ArrowLeftOutlined className="text-xs" />
      </button>

      {/* 菜单栏 */}
      <div className="flex items-center gap-0.5">
        {TOP_BAR_MENU_ITEMS.map((item) => (
          <button
            key={item}
            className="rounded px-2 py-0.5 text-xs text-[#cccccc] opacity-80 transition hover:bg-white/10 hover:opacity-100"
          >
            {item}
          </button>
        ))}
      </div>

      {/* 居中：搜索框 */}
      <div className="mx-auto flex w-64 items-center gap-2 rounded border border-[#454545] bg-[#3c3c3c] px-3 py-1 text-xs text-[#9d9d9d] transition hover:border-[#007acc]">
        <SearchOutlined className="text-xs" />
        <span>{projectName}</span>
      </div>

      {/* 右侧工具 */}
      <div className="ml-auto flex items-center gap-1">
        {[
          { icon: <QuestionCircleOutlined />, title: "帮助" },
          { icon: <SettingOutlined />, title: "设置" },
        ].map(({ icon, title }) => (
          <button
            key={title}
            title={title}
            className="flex h-7 w-7 items-center justify-center rounded text-[#cccccc] opacity-70 transition hover:bg-white/10 hover:opacity-100"
          >
            <span className="text-sm">{icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopBar;
