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
    <Model visible={open} title={title} onClose={onCancel} width="auto" data-oid="72c4qmg">
      <style>
        {`
          [data-oid="72c4qmg"] [data-oid="0pbqih6"] {
            text-align: center;
            flex: 1;
          }
          [data-oid="72c4qmg"] [data-oid="0pas9nr"] {
            border: 2px solid ${danger ? '#c21e1e' : 'var(--brand-accent)'};
            max-width: 480px;
          }
          [data-oid="a6y_157"].danger-btn {
            border-color: #c21e1e !important;
            color: #c21e1e !important;
          }
          [data-oid="a6y_157"].danger-btn:hover {
            background: rgba(194, 30, 30, 0.1) !important;
            border-color: #a30f0f !important;
            color: #a30f0f !important;
          }
          [data-oid="qaytm5."]:hover {
            color: var(--brand-accent);
            font-weight: 500;
          }
        `}
      </style>
      <div className="flex flex-col gap-3 min-w-[360px] px-2 py-1" data-oid="6v6yh0_">
        {description ? (
          <div
            className="text-[15px] leading-[1.6] text-[#4a4a4a] text-center transition-all cursor-default"
            data-oid="qaytm5."
          >
            {description}
          </div>
        ) : null}
        <div className="flex justify-center gap-2.5" data-oid="lxcum0k">
          <Button
            variant="outline"
            onClick={onCancel}
            data-oid="dpclpq8"
          >
            {cancelText}
          </Button>
          <Button
            variant="outline"
            className={danger ? "danger-btn" : ""}
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
