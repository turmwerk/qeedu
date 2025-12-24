import React, { useState } from 'react';
import styles from './style.module.scss';
import { Markdown } from '@/components/viz/Markdown';

interface Props {
  value?: string;
  onClose: (updated: string | null) => void; // pass null to cancel
}

const FullScreenMarkdownEditor: React.FC<Props> = ({ value = '', onClose }) => {
  const [text, setText] = useState(value);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.sheet}>
        <div className={styles.header}>
          <div className={styles.title}>全屏画布编辑</div>
          <div className={styles.actions}>
            <button className={styles.btn} onClick={() => onClose(null)}>取消</button>
            <button
              className={styles.primary}
              onClick={() => onClose(text)}
            >保存并退出</button>
          </div>
        </div>

        <div className={styles.editorWrap}>
          <div className={styles.preview}>
            <Markdown value={text} />
          </div>

          <textarea
            className={styles.editor}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default FullScreenMarkdownEditor;
