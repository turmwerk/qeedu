import http from "./http";
import type { WorkspaceRecord } from "@/feature/RecordWorkspace";

export type InternationalModuleKey =
  | "welcome-portal"
  | "exchange-hub"
  | "process-flow"
  | "pre-departure"
  | "matching-lab"
  | "abroad-life"
  | "cultural-training"
  | "return-service"
  | "writing-desk";

export interface InternationalDraft extends WorkspaceRecord {
  module: InternationalModuleKey;
}

export interface InternationalDraftListResponse {
  items: InternationalDraft[];
  total: number;
}

export interface InternationalDraftPayload {
  title: string;
  subtitle?: string;
  summary?: string;
  status?: string;
  tags?: string[];
  content: string;
}

export const listInternationalDrafts = async (
  module: InternationalModuleKey,
  params?: { keyword?: string; status?: string },
) =>
  http
    .get<InternationalDraftListResponse>(`/international/${module}/drafts`, { params })
    .then((response) => response.data);

export const createInternationalDraft = async (
  module: InternationalModuleKey,
  payload: InternationalDraftPayload,
) =>
  http
    .post<InternationalDraft>(`/international/${module}/drafts`, payload)
    .then((response) => response.data);

export const updateInternationalDraft = async (
  module: InternationalModuleKey,
  draftId: string,
  payload: Partial<InternationalDraftPayload>,
) =>
  http
    .patch<InternationalDraft>(`/international/${module}/drafts/${draftId}`, payload)
    .then((response) => response.data);

export const removeInternationalDraft = async (
  module: InternationalModuleKey,
  draftId: string,
) =>
  http.delete(`/international/${module}/drafts/${draftId}`).then((response) => response.data);

