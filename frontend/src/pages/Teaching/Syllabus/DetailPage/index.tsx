import React from 'react';
import PageHeader from '@/components/PageHeader';
import styles from './style.module.scss';
import shared from '@/pages/shared/style.module.scss';
import Dropdown from '@/components/Dropdown';
import { downloadMarkdown, downloadDocx, exportPdfViaPrint } from '@/utils/exportFiles';
import MarkdownView from '@/components/MarkdownView';
import MarkdownEditor from '@/components/MarkdownEditor';
import Dialog from '@/components/Dialog';

const DetailPage: React.FC<{
  md: string;
  setMd: (md: string) => void;
  onBack: () => void;
  openFull: boolean;
  setOpenFull: (v: boolean) => void;
  title?: string;
  id?: string;
}> = ({ md, setMd, onBack, openFull, setOpenFull, title, id }) => {
  return (
    <div>
      <PageHeader title="大纲设计" />
      <div className={shared.content}>
        <div className={styles.headerRow}>
          <div className={styles.leftTitle}>当前大纲：{title || '未命名课程'}</div>
          <div className={styles.rightAction}>
            <button className={styles.backBtn} onClick={onBack}>返回大纲目录</button>
            <Dropdown
              button="导出"
              items={[
                { label: '导出 PDF', onClick: () => exportPdfViaPrint(title || 'outline', md) },
                { label: '导出 Docx', onClick: () => downloadDocx(title || 'outline', md) },
                { label: '导出 Markdown', onClick: () => downloadMarkdown(title || 'outline', md) }
              ]}
            />
          </div>
        </div>
        <div className={styles.layout}>
          <div className={styles.leftPane}>
            <div className={styles.canvasCard}>
              <div className={styles.canvasHeader} />
              <div className={styles.canvasBody}>
                <MarkdownView value={md} onChange={setMd} onFullScreen={() => setOpenFull(true)} />
              </div>
            </div>
          </div>
          <div className={styles.rightPane}>
            <div className={styles.aiCard}>
              {/* 传入大纲id作为dialogId，保证唯一性 */}
              <Dialog 
                dialogId={id || 'default-outline'}
                botName="大纲助手"
                initMessage="欢迎使用大纲助手，你可以询问如何改进课程大纲。"
              />
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
