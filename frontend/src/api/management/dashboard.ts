import { createFeatureApi } from "@/api/featureFactory";

export const dashboardApi = createFeatureApi(
  "management",
  "dashboard",
  "insight-sessions",
);
