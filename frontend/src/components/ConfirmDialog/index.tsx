import React from "react";
import Model from "@/components/Model";
import Button from "@/components/Button";

type ConfirmDialogProps = {
  open: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: React.ReactNode;
  cancelText?: React.ReactNode;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "确认操作",
  description,
  confirmText = "确认",
  cancelText = "取消",
  danger,
  onConfirm,
  onCancel,
}) => {
  return (
    <Model visible={open} title={title} onClose={onCancel} data-oid="72c4qmg">
      <div className="flex flex-col gap-4" data-oid="6v6yh0_">
        {description ? (
          <div
            className="text-sm leading-[1.6] text-[var(--brand-muted)]"
            data-oid="qaytm5."
          >
            {description}
          </div>
        ) : null}
        <div className="flex justify-end gap-2.5" data-oid="lxcum0k">
          <Button
            variant="outline"
            onClick={onCancel}
            data-oid="dpclpq8"
          >
            {cancelText}
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            onClick={onConfirm}
            data-oid="a6y_157"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Model>
  );
};

export default ConfirmDialog;
