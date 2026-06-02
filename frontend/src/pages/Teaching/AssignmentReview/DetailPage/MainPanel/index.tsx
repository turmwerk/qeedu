import React from "react";
import AssignmentBriefSection from "./AssignmentBriefSection";
import SubmissionQueueSection from "./SubmissionQueueSection";
import ReviewContentSection from "./ReviewContentSection";
import TasksSection from "./TasksSection";
import ToolsSection from "./ToolsSection";
import type { AssignmentReviewRecord, AssignmentReviewSubmission } from "../../types";
import { assignmentReviewMainPanelShellClassName } from "../panelShell";

type Props = {
  record: AssignmentReviewRecord;
  selectedSubmission?: AssignmentReviewSubmission;
  assistantDialogId: string;
  onSelectSubmission: (submissionId: string) => void;
  onToggleTask: (taskId: string) => void;
  onAppendContent: (content: string, replace?: boolean) => void;
  onContentChange: (content: string) => void;
  onUploadFolder: (files: File[]) => void;
};

const AssignmentReviewMainPanel: React.FC<Props> = ({
  record,
  selectedSubmission,
  assistantDialogId,
  onSelectSubmission,
  onToggleTask,
  onAppendContent,
  onContentChange,
}) => {
  return (
    <div className={`${assignmentReviewMainPanelShellClassName} p-4`}>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex w-full min-w-0 flex-col gap-6 pr-1">
          <AssignmentBriefSection record={record} />

          <SubmissionQueueSection
            record={record}
            selectedSubmission={selectedSubmission}
            onSelectSubmission={onSelectSubmission}
          />

          <ReviewContentSection
            record={record}
            selectedSubmission={selectedSubmission}
            onAppendContent={onAppendContent}
            onContentChange={onContentChange}
          />

          <div className="grid gap-5 2xl:grid-cols-[0.92fr_1.08fr]">
            <TasksSection record={record} onToggleTask={onToggleTask} />
            <ToolsSection
              record={record}
              selectedSubmission={selectedSubmission}
              assistantDialogId={assistantDialogId}
              onAppendContent={onAppendContent}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentReviewMainPanel;
