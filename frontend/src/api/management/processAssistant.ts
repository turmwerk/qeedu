import { createFeatureApi } from "@/api/featureFactory";

export const processAssistantApi = createFeatureApi(
  "management",
  "process-assistant",
  "cases",
);
