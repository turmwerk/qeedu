import type { ComponentType } from "react";
import {
  createWorkspaceListModalComponent,
  getWorkspaceDetailPath,
  type WorkspaceConfig,
} from "@/feature/RecordWorkspace";
import type { ListModalProps } from "@/layouts/MainLayout/Sider/ListModal";
import { internationalWorkspaceConfigs } from "./International/config";
import { researchWorkspaceConfigs } from "./Research/config";

export type RegisteredWorkspaceModule = WorkspaceConfig & {
  listModalComponent: ComponentType<ListModalProps>;
  detailPathBuilder: (id: string) => string;
};

const registerWorkspaceModule = (
  config: WorkspaceConfig,
): RegisteredWorkspaceModule => ({
  ...config,
  listModalComponent: createWorkspaceListModalComponent(config),
  detailPathBuilder: (id: string) => getWorkspaceDetailPath(config, id),
});

export const internationalWorkspaceModules = internationalWorkspaceConfigs.map(
  registerWorkspaceModule,
);

export const researchWorkspaceModules = researchWorkspaceConfigs.map(
  registerWorkspaceModule,
);

export const allWorkspaceModules = [
  ...internationalWorkspaceModules,
  ...researchWorkspaceModules,
];

export const getWorkspaceModule = (key: string): RegisteredWorkspaceModule => {
  const module = allWorkspaceModules.find((item) => item.key === key);
  if (!module) {
    throw new Error(`Unknown workspace module: ${key}`);
  }
  return module;
};
