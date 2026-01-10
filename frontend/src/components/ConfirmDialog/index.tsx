import React from 'react';
import Model from '@/components/Model';
import styles from './style.module.scss';

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
      <div className={styles.body}>
        {description ? <div className={styles.desc}>{description}</div> : null}
        <div className={styles.actions}>
          <button className={styles.cancel} type="button" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`${styles.confirm} ${danger ? styles.danger : ''}`}
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
