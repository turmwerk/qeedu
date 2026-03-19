import type { ContextMenuItem } from "@/ui/ContextMenu";
import type { TopBarMenuId } from "../../data/topBar";
import type { MenuBuildOptions } from "./types";
import { buildEditMenu } from "./editMenu";
import { buildFileMenu } from "./fileMenu";
import { buildGoMenu } from "./goMenu";
import { buildHelpMenu } from "./helpMenu";
import { buildRunMenu } from "./runMenu";
import { buildSelectionMenu } from "./selectionMenu";
import { buildTerminalMenu } from "./terminalMenu";
import { buildViewMenu } from "./viewMenu";

export const buildTopBarMenus = (
  options: MenuBuildOptions,
): Record<TopBarMenuId, ContextMenuItem[]> => ({
  file: buildFileMenu(options),
  edit: buildEditMenu(options),
  selection: buildSelectionMenu(options),
  view: buildViewMenu(options),
  go: buildGoMenu(options),
  run: buildRunMenu(options),
  terminal: buildTerminalMenu(options),
  help: buildHelpMenu(options),
});

export type { MenuBuildOptions } from "./types";
