import type { ContextMenuItem } from "@/ui/ContextMenu";
import type { MenuBuildOptions } from "./types";
import { commandItem } from "./utils";

export const buildGoMenu = ({ commands }: MenuBuildOptions): ContextMenuItem[] => [
  commandItem(commands, "go.back"),
  commandItem(commands, "go.forward"),
  commandItem(commands, "go.lastEditLocation"),
  { type: "separator" },
  commandItem(commands, "go.switchEditor"),
  commandItem(commands, "go.switchGroup"),
  { type: "separator" },
  commandItem(commands, "go.gotoFile"),
  commandItem(commands, "go.gotoSymbolInWorkspace"),
  { type: "separator" },
  commandItem(commands, "go.gotoSymbolInEditor"),
  commandItem(commands, "go.gotoDefinition"),
  commandItem(commands, "go.gotoDeclaration"),
  commandItem(commands, "go.gotoTypeDefinition"),
  commandItem(commands, "go.gotoImplementation"),
  commandItem(commands, "go.gotoReferences"),
  { type: "separator" },
  commandItem(commands, "go.gotoLineColumn"),
  commandItem(commands, "go.gotoBracket"),
  { type: "separator" },
  commandItem(commands, "go.nextProblem"),
  commandItem(commands, "go.previousProblem"),
  { type: "separator" },
  commandItem(commands, "go.nextChange"),
  commandItem(commands, "go.previousChange"),
];
