import type { ContextMenuItem } from "@/ui/ContextMenu";
import type { MenuBuildOptions } from "./types";
import { commandItem } from "./utils";

export const buildHelpMenu = ({ commands }: MenuBuildOptions): ContextMenuItem[] => [
  commandItem(commands, "help.welcome"),
  commandItem(commands, "help.showAllCommands"),
  commandItem(commands, "help.editorPlayground"),
  commandItem(commands, "help.documentation"),
  commandItem(commands, "help.openWalkthrough"),
  commandItem(commands, "help.releaseNotes"),
  commandItem(commands, "help.accessibility"),
  commandItem(commands, "help.askVscode"),
  { type: "separator" },
  commandItem(commands, "help.keyboardShortcuts"),
  commandItem(commands, "help.videoTutorials"),
  commandItem(commands, "help.tipsAndTricks"),
  { type: "separator" },
  commandItem(commands, "help.joinYoutube"),
  commandItem(commands, "help.searchFeatureRequests"),
  commandItem(commands, "help.reportIssues"),
  { type: "separator" },
  commandItem(commands, "help.viewLicense"),
  commandItem(commands, "help.privacyStatement"),
  { type: "separator" },
  commandItem(commands, "help.toggleDevTools"),
  commandItem(commands, "help.openProcessExplorer"),
  { type: "separator" },
  commandItem(commands, "help.checkForUpdates"),
  commandItem(commands, "help.about"),
];
