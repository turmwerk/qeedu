import type { ContextMenuItem } from "@/ui/ContextMenu";
import type { MenuBuildOptions } from "./types";
import { commandItem } from "./utils";

export const buildEditMenu = ({ commands }: MenuBuildOptions): ContextMenuItem[] => [
  commandItem(commands, "edit.undo"),
  commandItem(commands, "edit.redo"),
  { type: "separator" },
  commandItem(commands, "edit.cut"),
  commandItem(commands, "edit.copy"),
  commandItem(commands, "edit.paste"),
  { type: "separator" },
  commandItem(commands, "edit.find"),
  commandItem(commands, "edit.replace"),
  { type: "separator" },
  commandItem(commands, "edit.findInFiles"),
  commandItem(commands, "edit.replaceInFiles"),
  { type: "separator" },
  commandItem(commands, "edit.toggleLineComment"),
  commandItem(commands, "edit.toggleBlockComment"),
  commandItem(commands, "edit.emmetExpand"),
];
