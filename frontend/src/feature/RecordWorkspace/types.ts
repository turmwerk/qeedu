import type { ReactNode } from "react";
import type { FormField } from "@/ui/Form";

export type WorkspaceEventSet = {
  updated: string;
  currentId: string;
  create: string;
  select: string;
  delete: string;
  siderState: string;
  toggleSider: string;
  getSiderState: string;
  siderWidth: string;
  getSiderWidth: string;
};

export type WorkspaceMetric = {
  label: string;
  value: string;
};

export type WorkspaceTask = {
  id: string;
  title: string;
  detail?: string;
  done: boolean;
  owner?: string;
  due?: string;
  priority?: "high" | "medium" | "low";
};

export type WorkspaceMilestoneStatus = "todo" | "doing" | "done" | "risk";

export type WorkspaceMilestone = {
  id: string;
  title: string;
  summary?: string;
  date?: string;
  status: WorkspaceMilestoneStatus;
};

export type WorkspaceReference = {
  label: string;
  value: string;
};

export type WorkspaceResource = {
  id: string;
  title: string;
  kind: string;
  summary: string;
  to?: string;
  href?: string;
};

export type WorkspaceTemplate = {
  id: string;
  title: string;
  summary?: string;
  content: string;
};

export type WorkspaceQuickAction = {
  id: string;
  title: string;
  description?: string;
  prompt: string;
  action: "append_prompt" | "append_template" | "copy_prompt";
  templateId?: string;
};

export type WorkspaceRelatedLink = {
  label: string;
  to: string;
};

export type WorkspaceRecord = {
  id: string;
  title: string;
  subtitle?: string;
  summary?: string;
  status?: string;
  tags?: string[];
  metrics?: WorkspaceMetric[];
  highlights?: string[];
  nextSteps?: string[];
  references?: WorkspaceReference[];
  tasks?: WorkspaceTask[];
  milestones?: WorkspaceMilestone[];
  resources?: WorkspaceResource[];
  templates?: WorkspaceTemplate[];
  quickActions?: WorkspaceQuickAction[];
  content: string;
  createdAt: number;
  updatedAt: number;
};

export type WorkspaceFilter = {
  key: string;
  label: string;
  match: (record: WorkspaceRecord) => boolean;
};

export type WorkspaceBuildRecordContext = {
  id: string;
  createdAt: number;
  payload: Record<string, unknown>;
};

export type WorkspaceConfig = {
  key: string;
  title: string;
  headline: string;
  subtitle: string;
  description: string;
  icon: ReactNode;
  routeBase: string;
  listTitle: string;
  listEmptyText: string;
  createModalTitle: string;
  createModalDescription?: string;
  createButtonLabel: string;
  searchPlaceholder: string;
  createFields: FormField[];
  filters: WorkspaceFilter[];
  storageKey: string;
  currentKey: string;
  counterKey: string;
  events: WorkspaceEventSet;
  botName: string;
  botIntro: string;
  assistantPrompts: string[];
  capabilities?: string[];
  deliverables?: string[];
  relatedLinks?: WorkspaceRelatedLink[];
  buildRecord: (context: WorkspaceBuildRecordContext) => WorkspaceRecord;
};
