import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useContextMenu } from "@/ui/ContextMenu";
import { showToast } from "@/ui/Toast";
import { TOP_BAR_MENU_ITEMS, type TopBarMenuId } from "../data/topBar";
import { useWorkspace } from "../context";
import BackButton from "./BackButton";
import MenuBar from "./MenuBar";
import ProjectSearch from "./ProjectSearch";
import RightActions from "./RightActions";
import { buildTopBarMenus } from "./Menu";
import {
  type ProjectCommand,
  type ProjectCommandId,
  type ProjectCommandState,
} from "../Shortcuts/commands";

interface TopBarProps {
  commands: Record<ProjectCommandId, ProjectCommand>;
  state: ProjectCommandState;
}

const TopBar: React.FC<TopBarProps> = ({ commands, state }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openAtEvent } = useContextMenu();
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

  const menuMap = useMemo(
    () => buildTopBarMenus({ commands, state }),
    [commands, state],
  );

  const handleMenuOpen = (id: TopBarMenuId, event: React.MouseEvent) => {
    const items = menuMap[id];
    if (!items || items.length === 0) {
      showToast("该菜单暂无内容");
      return;
    }
    openAtEvent(event, items);
  };

  return (
    <div className="flex h-9 w-full shrink-0 select-none items-center bg-[#323233] px-2">
      <BackButton onClick={handleBack} />
      <MenuBar items={TOP_BAR_MENU_ITEMS} onMenuOpen={handleMenuOpen} />
      <ProjectSearch
        projectName={projectName}
        onClick={commands["go.gotoFile"].handler}
      />
      <RightActions
        onHelp={commands["app.openHelp"].handler}
        onSettings={commands["app.openSettings"].handler}
      />
    </div>
  );
};

export default TopBar;
