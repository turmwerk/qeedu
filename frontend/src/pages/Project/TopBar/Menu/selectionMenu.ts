import type { ContextMenuItem } from "@/ui/ContextMenu";
import type { MenuBuildOptions } from "./types";
import { commandItem } from "./utils";

export const buildSelectionMenu = ({ commands }: MenuBuildOptions): ContextMenuItem[] => [
  commandItem(commands, "selection.selectAll"),
  commandItem(commands, "selection.expandSelection"),
  commandItem(commands, "selection.shrinkSelection"),
  { type: "separator" },
  commandItem(commands, "selection.copyLineUp"),
  commandItem(commands, "selection.copyLineDown"),
  commandItem(commands, "selection.moveLineUp"),
  commandItem(commands, "selection.moveLineDown"),
  commandItem(commands, "selection.duplicateSelection"),
  { type: "separator" },
  commandItem(commands, "selection.addCursorAbove"),
  commandItem(commands, "selection.addCursorBelow"),
  commandItem(commands, "selection.addCursorToLineEnd"),
  commandItem(commands, "selection.addNextMatch"),
  commandItem(commands, "selection.addPrevMatch"),
  commandItem(commands, "selection.selectAllMatches"),
  { type: "separator" },
  commandItem(commands, "selection.toggleMultiCursorModifier"),
  commandItem(commands, "selection.toggleColumnSelection"),
];
