import http from "./http";

export type FeaturePageResponse<T = unknown> = Promise<T>;

export const createFeatureApi = <TRecord = unknown, TPageData = unknown>(
  domain: string,
  feature: string,
  resource: string,
) => {
  const base = `/${domain}/${feature}`;
  const resourceBase = `${base}/${resource}`;

  return {
    pageData: () => http.get<TPageData>(`${base}/page-data`).then((res) => res.data),
    list: (params?: Record<string, unknown>) =>
      http.get<TRecord[]>(resourceBase, { params }).then((res) => res.data),
    create: (payload: Record<string, unknown>) =>
      http.post<TRecord>(resourceBase, payload).then((res) => res.data),
    detail: (id: string) =>
      http.get<TRecord>(`${resourceBase}/${id}`).then((res) => res.data),
    update: (id: string, payload: Record<string, unknown>) =>
      http.patch<TRecord>(`${resourceBase}/${id}`, payload).then((res) => res.data),
    remove: (id: string) =>
      http.delete(`${resourceBase}/${id}`).then((res) => res.data),
    messages: (id: string) =>
      http.get(`${resourceBase}/${id}/messages`).then((res) => res.data),
    chatPath: (id: string) => `${resourceBase}/${id}/chat`,
  };
};
