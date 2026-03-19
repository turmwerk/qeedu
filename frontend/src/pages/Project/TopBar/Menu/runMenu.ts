import type { ContextMenuItem } from "@/ui/ContextMenu";
import type { MenuBuildOptions } from "./types";
import { commandItem } from "./utils";

export const buildRunMenu = ({ commands, state }: MenuBuildOptions): ContextMenuItem[] => [
  commandItem(commands, "run.startDebugging"),
  commandItem(commands, "run.runWithoutDebugging", {
    disabled: !state.isRunnable || state.running,
  }),
  commandItem(commands, "run.stopDebugging"),
  commandItem(commands, "run.restartDebugging"),
  { type: "separator" },
  commandItem(commands, "run.openConfigurations"),
  commandItem(commands, "run.addConfiguration"),
  { type: "separator" },
  commandItem(commands, "run.stepOver"),
  commandItem(commands, "run.stepInto"),
  commandItem(commands, "run.stepOut"),
  commandItem(commands, "run.continue"),
  { type: "separator" },
  commandItem(commands, "run.toggleBreakpoint"),
  commandItem(commands, "run.newBreakpoint"),
  { type: "separator" },
  commandItem(commands, "run.enableAllBreakpoints"),
  commandItem(commands, "run.disableAllBreakpoints"),
  commandItem(commands, "run.removeAllBreakpoints"),
  { type: "separator" },
  commandItem(commands, "run.installAdditionalDebuggers"),
];
