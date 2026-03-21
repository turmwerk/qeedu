import type {
  WorkspaceResource,
  WorkspaceTask,
  WorkspaceTemplate,
} from "@/feature/RecordWorkspace/types";
import type { FeatureRecordBase } from "@/utils/feature/storage";

export type AssignmentReviewSubmission = {
  id: string;
  studentName: string;
  score: string;
  status: string;
};

export type AssignmentReviewRecord = FeatureRecordBase & {
  subtitle?: string;
  tags?: string[];
  content: string;
  tasks?: WorkspaceTask[];
  submissions?: AssignmentReviewSubmission[];
  templates?: WorkspaceTemplate[];
  resources?: WorkspaceResource[];
};
