import type {
  ProjectCommand,
  ProjectCommandId,
  ProjectCommandState,
} from "../../Shortcuts/commands";

export interface MenuBuildOptions {
  commands: Record<ProjectCommandId, ProjectCommand>;
  state: ProjectCommandState;
}
