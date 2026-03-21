import React from "react";
import ActionDock from "@/feature/RecordWorkspace/ActionDock";
import ResourceBoard from "@/feature/RecordWorkspace/ResourceBoard";
import TemplateWorkbench from "@/feature/RecordWorkspace/TemplateWorkbench";
import { assignmentReviewQuickActions } from "@/pages/Teaching/featureData";
import type { AssignmentReviewRecord } from "../../../types";

type Props = {
  record: AssignmentReviewRecord;
  onAppendContent: (content: string, replace?: boolean) => void;
};

const ToolsSection: React.FC<Props> = ({ record, onAppendContent }) => {
  return (
    <div className="space-y-5">
      {record.templates?.length ? (
        <TemplateWorkbench templates={record.templates} onInsert={onAppendContent} />
      ) : null}

      <ActionDock
        actions={assignmentReviewQuickActions}
        templates={record.templates ?? []}
        onInsert={onAppendContent}
      />

      {record.resources?.length ? <ResourceBoard resources={record.resources} /> : null}
    </div>
  );
};

export default ToolsSection;
