import React, { useState } from "react";
import Form from "@/ui/Form";
import Modal from "@/ui/Modal";
import type { WorkspaceConfig } from "./types";

type Props = {
  config: WorkspaceConfig;
  open: boolean;
  onClose: () => void;
  onCreate: (payload: Record<string, unknown>) => void;
};

const WorkspaceCreateModal: React.FC<Props> = ({
  config,
  open,
  onClose,
  onCreate,
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = (values: Record<string, unknown>) => {
    if (isCreating) return;
    setIsCreating(true);
    window.setTimeout(() => {
      onCreate(values);
      onClose();
      setIsCreating(false);
    }, 500);
  };

  return (
    <Modal
      visible={open}
      title={config.createModalTitle}
      width={960}
      onClose={onClose}
    >
      <div className="space-y-3">
        {config.createModalDescription && (
          <p className="m-0 text-sm text-[#5f6b7a] dark:text-[#d4deef]">
            {config.createModalDescription}
          </p>
        )}
        <Form
          mode="table"
          fields={config.createFields}
          submitText={config.createButtonLabel}
          submitLoading={isCreating}
          submitLoadingText="生成中"
          submitDisabled={isCreating}
          onSubmit={handleSubmit}
        />
      </div>
    </Modal>
  );
};

export default WorkspaceCreateModal;

