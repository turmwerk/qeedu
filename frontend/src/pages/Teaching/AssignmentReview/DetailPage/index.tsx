import React, { useEffect, useRef } from "react";
import SplitSiderLayout from "@/layouts/SplitSiderLayout";
import { assignmentReviewAdapter } from "@/pages/Teaching/featureAdapters";
import AssistantPanel from "./AssistantPanel";
import Header from "./Header";
import MainPanel from "./MainPanel";
import type { AssignmentReviewRecord, AssignmentReviewSubmission } from "../types";

type Props = {
  record: AssignmentReviewRecord;
  selectedSubmission?: AssignmentReviewSubmission;
  onBack: () => void;
  onSelectSubmission: (submissionId: string) => void;
  onToggleTask: (taskId: string) => void;
  onGenerateFeedback: () => void;
  onWriteback: () => void;
  onExportRubric: () => void;
  onAppendContent: (content: string, replace?: boolean) => void;
  onContentChange: (content: string) => void;
  onUploadFolder: (files: File[]) => void;
};

const AssignmentReviewDetailPage: React.FC<Props> = ({
  record,
  selectedSubmission,
  onBack,
  onSelectSubmission,
  onToggleTask,
  onGenerateFeedback,
  onWriteback,
  onExportRubric,
  onAppendContent,
  onContentChange,
  onUploadFolder,
}) => {
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const input = folderInputRef.current;
    if (!input) return;
    input.setAttribute("webkitdirectory", "");
    input.setAttribute("directory", "");
  }, []);

  const handleFolderSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    onUploadFolder(files);
    event.target.value = "";
  };

  return (
        <div className="flex h-full min-h-0 w-full flex-col overflow-hidden px-4 pb-4 md:px-6 xl:px-8">

      <input
        ref={folderInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFolderSelection}
      />
      <div className="shrink-0 py-2">
        <Header
          record={record}
          selectedSubmission={selectedSubmission}
          onBack={onBack}
          onUploadFolder={() => folderInputRef.current?.click()}
          onGenerateFeedback={onGenerateFeedback}
          onWriteback={onWriteback}
          onExportRubric={onExportRubric}
        />
      </div>
      <SplitSiderLayout
        className="flex-1 min-h-0 min-w-0 h-full overflow-hidden"
        leftClassName="flex h-full min-h-0 min-w-0 flex-col overflow-hidden"
        rightClassName="flex h-full min-h-0 min-w-0 flex-col overflow-hidden"
        left={
          <MainPanel
            record={record}
            selectedSubmission={selectedSubmission}
            onSelectSubmission={onSelectSubmission}
            onToggleTask={onToggleTask}
            onAppendContent={onAppendContent}
            onContentChange={onContentChange}
            onUploadFolder={onUploadFolder}
          />
        }
        right={
          <AssistantPanel
            dialogId={`assignment-review-${record.id}-${selectedSubmission?.id ?? "main"}`}
            botName="批改协同助手"
            initMessage="我已经读取当前批改任务和提交上下文，可以继续生成反馈、复核 rubric 或整理回写建议。"
            transport={assignmentReviewAdapter.createChatTransport(
              `${record.title}${selectedSubmission ? ` / ${selectedSubmission.studentName}` : ""}`,
            )}
          />
        }
      />
    </div>
  );
};

export default AssignmentReviewDetailPage;
