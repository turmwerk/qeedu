import type { ContextMenuItem } from "@/ui/ContextMenu";
import type { ProjectCommand, ProjectCommandId } from "../../Shortcuts/commands";

export const commandItem = (
  commands: Record<ProjectCommandId, ProjectCommand>,
  id: ProjectCommandId,
  overrides: Partial<ContextMenuItem> = {},
): ContextMenuItem => {
  const cmd = commands[id];
  return {
    label: cmd.label,
    shortcut: cmd.shortcut,
    onClick: cmd.handler,
    ...overrides,
  };
};
