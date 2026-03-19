import http from "./http";
import type { WorkspaceRecord } from "@/feature/RecordWorkspace";

export type ResearchModuleKey =
  | "literature-search"
  | "paper-reader"
  | "paper-writing";

export interface ResearchDraft extends WorkspaceRecord {
  module: ResearchModuleKey;
}

export interface ResearchDraftListResponse {
  items: ResearchDraft[];
  total: number;
}

export interface ResearchDraftPayload {
  title: string;
  subtitle?: string;
  summary?: string;
  status?: string;
  tags?: string[];
  content: string;
}

export const listResearchDrafts = async (
  module: ResearchModuleKey,
  params?: { keyword?: string; status?: string },
) =>
  http
    .get<ResearchDraftListResponse>(`/research/${module}/drafts`, { params })
    .then((response) => response.data);

export const createResearchDraft = async (
  module: ResearchModuleKey,
  payload: ResearchDraftPayload,
) =>
  http
    .post<ResearchDraft>(`/research/${module}/drafts`, payload)
    .then((response) => response.data);

export const updateResearchDraft = async (
  module: ResearchModuleKey,
  draftId: string,
  payload: Partial<ResearchDraftPayload>,
) =>
  http
    .patch<ResearchDraft>(`/research/${module}/drafts/${draftId}`, payload)
    .then((response) => response.data);

export const removeResearchDraft = async (
  module: ResearchModuleKey,
  draftId: string,
) => http.delete(`/research/${module}/drafts/${draftId}`).then((response) => response.data);
