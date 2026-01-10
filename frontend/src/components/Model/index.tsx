import React from 'react';
import { createPortal } from 'react-dom';
import styles from './style.module.scss';

const Model: React.FC<{ visible: boolean; title?: React.ReactNode; onClose: () => void; children?: React.ReactNode; width?: number | string }> = ({ visible, title, onClose, children, width }) => {
  if (!visible) return null;
  return createPortal(
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.dialog} style={width ? { width } : undefined} onMouseDown={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <button className={styles.close} onClick={onClose}>×</button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Model;
