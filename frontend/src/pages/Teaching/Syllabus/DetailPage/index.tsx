import React from 'react';
import PageHeader from '@/components/PageHeader';
import styles from '../style.module.scss';
import shared from '@/pages/shared/style.module.scss';
import Dropdown from '@/components/Dropdown';
import MarkdownView from '@/components/MarkdownView';
import MarkdownEditor from '@/components/MarkdownEditor';

const DetailPage: React.FC<{
  md: string;
  setMd: (md: string) => void;
  onBack: () => void;
  openFull: boolean;
  setOpenFull: (v: boolean) => void;
}> = ({ md, setMd, onBack, openFull, setOpenFull }) => {
  return (
    <div>
      <PageHeader title="大纲设计" />
      <div className={shared.content}>
        <div className={styles.headerRow}>
          <div className={styles.leftTitle}>当前大纲：课程大纲设计</div>
          <div className={styles.rightAction}>
            <button className={styles.backBtn} onClick={onBack}>返回大纲目录</button>
            <Dropdown
              button="导出"
              items={[
                { label: '导出 PDF', onClick: () => alert('PDF') },
                { label: '导出 Docx', onClick: () => alert('Docx') },
                { label: '导出 Markdown', onClick: () => alert('Markdown') }
              ]}
            />
          </div>
        </div>
        <div className={styles.layout}>
          <div className={styles.leftPane}>
            <div className={styles.canvasCard}>
              <div className={styles.canvasHeader}>
                <div className="titleLeft">大纲预览（Canvas/Markdown）</div>
                <button
                  className={styles.editBtn}
                  onClick={() => setOpenFull(true)}
                  aria-label="编辑 Markdown"
                >
                  编辑 Markdown
                </button>
              </div>
              <div className={styles.canvasBody}>
                <MarkdownView value={md} />
              </div>
            </div>
          </div>
          <div className={styles.rightPane}>
            <div className={styles.aiCard}>
              <h3>AI 对话</h3>
              <p className={styles.aiDesc}>预留模型接入通道，可承接生成与优化能力。</p>
              <div className={styles.aiPlaceholder}>对话组件占位（后续实现）</div>
            </div>
          </div>
        </div>
        {openFull && (
          <MarkdownEditor
            value={md}
            onClose={(updated) => {
              if (updated !== null) setMd(updated);
              setOpenFull(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DetailPage;
