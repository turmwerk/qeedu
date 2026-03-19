import type { ContextMenuItem } from "@/ui/ContextMenu";
import type { MenuBuildOptions } from "./types";
import { commandItem } from "./utils";

export const buildTerminalMenu = ({ commands }: MenuBuildOptions): ContextMenuItem[] => [
  commandItem(commands, "terminal.newTerminal"),
  commandItem(commands, "terminal.splitTerminal"),
  commandItem(commands, "terminal.runTask"),
  commandItem(commands, "terminal.runBuildTask"),
  commandItem(commands, "terminal.runTestTask"),
  commandItem(commands, "terminal.runActiveFile"),
  commandItem(commands, "terminal.runSelectedText"),
  commandItem(commands, "terminal.runRecentCommand"),
  commandItem(commands, "terminal.showRunningTasks"),
  { type: "separator" },
  commandItem(commands, "terminal.configureTasks"),
  commandItem(commands, "terminal.terminateTask"),
  { type: "separator" },
  commandItem(commands, "terminal.killTerminal"),
  commandItem(commands, "terminal.killAllTerminals"),
  { type: "separator" },
  commandItem(commands, "terminal.clearTerminal"),
  commandItem(commands, "terminal.clearAllTerminals"),
  { type: "separator" },
  commandItem(commands, "terminal.renameTerminal"),
  { type: "separator" },
  commandItem(commands, "terminal.selectDefaultProfile"),
  commandItem(commands, "terminal.configureTerminalSettings"),
  { type: "separator" },
  commandItem(commands, "terminal.focusNextTerminal"),
  commandItem(commands, "terminal.focusPreviousTerminal"),
  { type: "separator" },
  commandItem(commands, "terminal.toggleTerminalPanel"),
];
