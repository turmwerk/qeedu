import React from "react";
import Modal from "@/ui/Modal";
import MarkdownView from "@/feature/MarkdownView";

type PreviewModalProps = {
  open: boolean;
  onClose: () => void;
  markdown: string;
};

const PreviewModal: React.FC<PreviewModalProps> = ({ open, onClose, markdown }) => {
  return (
    <Modal visible={open} title="璇曞嵎棰勮" onClose={onClose}>
      <div className="h-[520px] min-h-[320px] max-h-[70vh]">
        <MarkdownView value={markdown} />
      </div>
    </Modal>
  );
};

export default PreviewModal;
