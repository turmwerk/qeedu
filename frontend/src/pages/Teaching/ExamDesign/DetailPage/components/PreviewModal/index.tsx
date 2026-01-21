import React from "react";
import Model from "@/components/Model";
import MarkdownView from "@/components/MarkdownView";

type PreviewModalProps = {
  open: boolean;
  onClose: () => void;
  markdown: string;
};

const PreviewModal: React.FC<PreviewModalProps> = ({ open, onClose, markdown }) => {
  return (
    <Model visible={open} title="试卷预览" onClose={onClose}>
      <div className="h-[520px] min-h-[320px] max-h-[70vh]">
        <MarkdownView value={markdown} showControls={false} />
      </div>
    </Model>
  );
};

export default PreviewModal;
