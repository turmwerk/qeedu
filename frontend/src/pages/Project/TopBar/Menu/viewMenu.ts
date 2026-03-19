import type { ContextMenuItem } from "@/ui/ContextMenu";
import type { MenuBuildOptions } from "./types";
import { commandItem } from "./utils";

export const buildViewMenu = ({ commands }: MenuBuildOptions): ContextMenuItem[] => [
  commandItem(commands, "view.commandPalette"),
  commandItem(commands, "view.openView"),
  { type: "separator" },
  commandItem(commands, "view.appearance"),
  commandItem(commands, "view.editorLayout"),
  { type: "separator" },
  commandItem(commands, "view.explorer"),
  commandItem(commands, "view.search"),
  commandItem(commands, "view.sourceControl"),
  commandItem(commands, "view.run"),
  commandItem(commands, "view.extensions"),
  { type: "separator" },
  commandItem(commands, "view.chat"),
  commandItem(commands, "view.problems"),
  commandItem(commands, "view.output"),
  commandItem(commands, "view.debugConsole"),
  commandItem(commands, "view.terminal"),
  { type: "separator" },
  commandItem(commands, "view.toggleWordWrap"),
];
