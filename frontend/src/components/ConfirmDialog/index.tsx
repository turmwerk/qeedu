import React from 'react';
import Model from '@/components/Model';

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
  title = '确认操作',
  description,
  confirmText = '确认',
  cancelText = '取消',
  danger,
  onConfirm,
  onCancel,
}) => {
  return (
    <Model visible={open} title={title} onClose={onCancel}>
      <div className="flex flex-col gap-4">
        {description ? <div className="text-sm leading-[1.6] text-[var(--brand-muted)]">{description}</div> : null}
        <div className="flex justify-end gap-2.5">
          <button className="bg-transparent border border-[var(--brand-border)] text-[var(--brand-accent)] px-3.5 py-2 rounded-[10px] cursor-pointer font-semibold transition-[background,border-color,box-shadow] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]" type="button" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`${danger ? 'bg-[#c21e1e] hover:bg-[#a30f0f] hover:shadow-[0_10px_24px_rgba(194,30,30,0.2)]' : 'bg-[var(--brand-accent)] hover:bg-[var(--brand-accent-strong)] hover:shadow-[var(--brand-shadow)]'} text-white px-3.5 py-2 rounded-[10px] cursor-pointer font-semibold border-0 transition-[background,box-shadow]`}
            type="button"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Model>
  );
};

export default ConfirmDialog;
