import React from 'react';
import styles from './style.module.scss';

const ExportDropdown: React.FC = () => {
  return (
    <div className={styles.container} aria-haspopup="true">
      <button className={styles.button} aria-expanded={false}>
        导出
      </button>
      <div className={styles.menu} role="menu">
        <button className={styles.item} role="menuitem">导出 PDF</button>
        <button className={styles.item} role="menuitem">导出 Docx</button>
        <button className={styles.item} role="menuitem">导出 Markdown</button>
      </div>
    </div>
  );
};

export default ExportDropdown;
