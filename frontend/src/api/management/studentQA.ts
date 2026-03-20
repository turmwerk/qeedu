import { createFeatureApi } from "@/api/featureFactory";

export const studentQAApi = createFeatureApi(
  "management",
  "student-qa",
  "threads",
);
