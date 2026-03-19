import type { ContextMenuItem } from "@/ui/ContextMenu";
import type { MenuBuildOptions } from "./types";
import { commandItem } from "./utils";

export const buildFileMenu = ({ commands, state }: MenuBuildOptions): ContextMenuItem[] => [
  commandItem(commands, "file.newTextFile"),
  commandItem(commands, "file.newFile"),
  commandItem(commands, "file.newWindow"),
  commandItem(commands, "file.newWindowWithProfile"),
  { type: "separator" },
  commandItem(commands, "file.openFile"),
  commandItem(commands, "file.openFolder"),
  commandItem(commands, "file.openWorkspace"),
  commandItem(commands, "file.openRecent"),
  { type: "separator" },
  commandItem(commands, "file.addFolderToWorkspace"),
  commandItem(commands, "file.saveWorkspaceAs"),
  commandItem(commands, "file.duplicateWorkspace"),
  { type: "separator" },
  commandItem(commands, "file.save", { disabled: !state.hasActiveTab }),
  commandItem(commands, "file.saveAs", { disabled: !state.hasActiveTab }),
  commandItem(commands, "file.saveAll", { disabled: !state.hasTabs }),
  { type: "separator" },
  commandItem(commands, "file.share"),
  { type: "separator" },
  commandItem(commands, "file.autoSave", { checked: true }),
  commandItem(commands, "file.preferences"),
  { type: "separator" },
  commandItem(commands, "file.revertFile", { disabled: !state.hasActiveTab }),
];
