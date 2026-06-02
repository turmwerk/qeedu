import React from "react";
import Modal from "@/ui/Modal";
import Form, { type FormField } from "@/ui/Form";

type Props = {
  open: boolean;
  title: React.ReactNode;
  fields: FormField[];
  onClose: () => void;
  onSubmit: (values: Record<string, unknown>) => void;
  submitText?: React.ReactNode;
};

const FeatureRecordDialog: React.FC<Props> = ({
  open,
  title,
  fields,
  onClose,
  onSubmit,
  submitText,
}) => {
  return (
    <Modal visible={open} title={title} onClose={onClose} width={760} opaque>
      <Form
        fields={fields}
        onSubmit={onSubmit}
        submitText={submitText ?? "创建记录"}
        mode="table"
        className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 dark:border-[rgba(31,196,31,0.22)] dark:bg-[rgba(31,196,31,0.12)]"
      />
    </Modal>
  );
};

export default FeatureRecordDialog;
