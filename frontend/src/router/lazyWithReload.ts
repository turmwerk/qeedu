import { lazy, type ComponentType } from "react";
import { importWithChunkRecovery } from "@/utils/chunkRecovery";

export const lazyWithReload = <T extends ComponentType<any>>(
  importer: () => Promise<{ default: T }>,
) => lazy(() => importWithChunkRecovery(importer));
