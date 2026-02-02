import React from "react";
import Modal from "@/components/Modal";
import MarkdownView from "@/components/MarkdownView";

type PreviewModalProps = {
  open: boolean;
  onClose: () => void;
  markdown: string;
};

const PreviewModal: React.FC<PreviewModalProps> = ({ open, onClose, markdown }) => {
  return (
    <Modal visible={open} title="试卷预览" onClose={onClose}>
      <div className="h-[520px] min-h-[320px] max-h-[70vh]">
        <MarkdownView value={markdown} />
      </div>
    </Modal>
  );
};

export default PreviewModal;
