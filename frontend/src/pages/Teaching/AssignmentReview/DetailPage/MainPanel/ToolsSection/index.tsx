import React from "react";
import ActionDock from "@/feature/RecordWorkspace/ActionDock";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import TemplateWorkbench from "@/feature/RecordWorkspace/TemplateWorkbench";
import { assignmentReviewQuickActions } from "@/pages/Teaching/featureData";
import { buildRecordActionPrompt, runRecordAIAction } from "@/pages/shared/workbench";
import type { AssignmentReviewRecord, AssignmentReviewSubmission } from "../../../types";

type Props = {
  record: AssignmentReviewRecord;
  selectedSubmission?: AssignmentReviewSubmission;
  assistantDialogId: string;
  onAppendContent: (content: string, replace?: boolean) => void;
};

const ToolsSection: React.FC<Props> = ({
  record,
  selectedSubmission,
  assistantDialogId,
  onAppendContent,
}) => {
  const runAIAction = (prompt: string) => {
    runRecordAIAction(
      assistantDialogId,
      buildRecordActionPrompt(prompt, record, [
        {
          label: "当前学生",
          value: selectedSubmission
            ? `${selectedSubmission.studentName} ${selectedSubmission.score} ${selectedSubmission.status}`
            : "",
        },
        {
          label: "提交队列",
          value: (record.submissions ?? [])
            .map((item) => `${item.studentName} ${item.score} ${item.status}`)
            .join("；"),
        },
      ]),
    );
  };

  return (
    <div className="space-y-5">
      {record.templates?.length ? (
        <TemplateWorkbench templates={record.templates} onInsert={onAppendContent} />
      ) : null}

      <ActionDock
        actions={assignmentReviewQuickActions}
        templates={record.templates ?? []}
        onInsert={onAppendContent}
        onRunAI={runAIAction}
      />

      {record.resources?.length ? <ResourceBoard resources={record.resources} /> : null}
    </div>
  );
};

export default ToolsSection;
