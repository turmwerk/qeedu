import React from "react";
import { useWorkspace } from "../../context";
import FileTabBar from "./components/FileTabBar";
import Breadcrumb from "./components/Breadcrumb";
import Views from "./components/Views";

const EditorArea: React.FC = () => {
  const { tabs, activeTabId } = useWorkspace();
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? null;

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden bg-[#1e1e1e]">
      {/* 文件 Tab 栏 */}
      <FileTabBar />

      {/* 面包屑（有激活文件时显示） */}
      {activeTab && <Breadcrumb path={activeTab.id} />}

      {/* 内容视图 */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <Views activeTab={activeTab} />
      </div>
    </div>
  );
};

export default EditorArea;
