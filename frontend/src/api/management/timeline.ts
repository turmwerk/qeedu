import { createFeatureApi } from "@/api/featureFactory";

export const timelineApi = createFeatureApi(
  "management",
  "timeline",
  "timelines",
);
