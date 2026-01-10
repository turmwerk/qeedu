import React, { useEffect, useState } from 'react';
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
  onRename?: (id: string, title: string) => void;
}> = ({ md, setMd, onBack, openFull, setOpenFull, title, id, onRename }) => {
  const [localTitle, setLocalTitle] = useState(title || '');

  useEffect(() => {
    setLocalTitle(title || '');
  }, [title]);

  const handleTitleChange = (next: string) => {
    setLocalTitle(next);
    if (id && onRename) onRename(id, next);
  };

  const displayTitle = localTitle || title || '未命名课程';
  return (
    <div>
      <PageHeader title="大纲设计" />
      <div className={shared.content}>
        <div className={styles.headerCard}>
          <div className={styles.headerRow}>
            <input
              className={styles.titleInputLarge}
              type="text"
              value={localTitle}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="未命名课程"
            />
            <div className={styles.rightAction}>
              <div className={styles.scoreBox}>
                <div className={styles.scoreLabel}>总分</div>
                <div className={styles.scoreValue}>90</div>
              </div>
              <button className={styles.backBtn} onClick={onBack}>返回大纲目录</button>
              <Dropdown
                button="导出"
                items={[
                  { label: '导出 PDF', onClick: () => exportPdfViaPrint(displayTitle, md) },
                  { label: '导出 Docx', onClick: () => downloadDocx(displayTitle, md) },
                  { label: '导出 Markdown', onClick: () => downloadMarkdown(displayTitle, md) }
                ]}
              />
            </div>
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
