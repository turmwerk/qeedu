import React from "react";
import { useWorkspace } from "../../../context";
import { useContextMenu, type ContextMenuItem } from "@/ui/ContextMenu";
import FolderNode from "./FileTree/FolderNode";
import TreeActions from "./TreeActions";

const ExplorerPanel: React.FC = () => {
  const { fileTree, projectName, addFile, addFolder, refreshFileTree } =
    useWorkspace();
  const { openAtEvent } = useContextMenu();

  const handleAddFile = (parentPath = fileTree.path) => {
    const name = window.prompt("New file name", "untitled.txt");
    if (!name) return;
    addFile(parentPath, name, true);
  };

  const handleAddFolder = (parentPath = fileTree.path) => {
    const name = window.prompt("New folder name", "new-folder");
    if (!name) return;
    addFolder(parentPath, name);
  };

  const handlePanelContextMenu = (event: React.MouseEvent) => {
    const items: ContextMenuItem[] = [
      { label: "New File", onClick: () => handleAddFile() },
      { label: "New Folder", onClick: () => handleAddFolder() },
      { type: "separator" },
      { label: "Refresh", onClick: refreshFileTree },
    ];
    openAtEvent(event, items);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-[#3c3c3c] px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#bbbbbb]">
          {projectName}
        </span>
        <TreeActions
          onAddFile={() => handleAddFile()}
          onAddFolder={() => handleAddFolder()}
          onRefresh={refreshFileTree}
        />
      </div>

      <div
        className="min-h-0 flex-1 overflow-y-auto py-1"
        onContextMenu={handlePanelContextMenu}
      >
        <FolderNode node={fileTree} depth={0} />
      </div>
    </div>
  );
};

export default ExplorerPanel;
