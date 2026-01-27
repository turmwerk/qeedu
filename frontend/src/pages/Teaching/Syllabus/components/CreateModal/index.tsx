import React, { useState } from "react";
import Modal from "@/components/Modal";
import Form from "@/components/Form";
import { syllabusCreateFields } from "../../data/createModalFields";

type CreateModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: Record<string, unknown>) => void;
};

const CreateModal: React.FC<CreateModalProps> = ({ open, onClose, onCreate }) => {
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = (values: Record<string, unknown>) => {
    if (isCreating) return;
    setIsCreating(true);
    setTimeout(() => {
      onCreate(values);
      onClose();
      setIsCreating(false);
    }, 600);
  };

  return (
    <Modal  
      visible={open}
      title="新建课程大纲"
      width={1000}
      onClose={onClose}
    >
      <div>
        <p className="text-[#666]">
          简要表单保证必填槽位，然后进入双栏协作。
        </p>
        <div className="mt-3">
          <Form
            mode="table"
            fields={syllabusCreateFields}
            submitText="生成初稿"
            submitLoading={isCreating}
            submitLoadingText="生成中"
            submitDisabled={isCreating}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CreateModal;
