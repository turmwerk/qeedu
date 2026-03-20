import { createFeatureApi } from "@/api/featureFactory";

export const announcementGeneratorApi = createFeatureApi(
  "management",
  "announcement-generator",
  "announcements",
);
