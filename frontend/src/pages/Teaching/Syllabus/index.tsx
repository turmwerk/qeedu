import React, { useState } from 'react';
import PageHeader from '@/components/base/PageHeader';
import shared from '@/pages/shared/style.module.scss';
import styles from './style.module.scss';
import ExportDropdown from '@/components/base/ExportDropdown';
import { Markdown } from '@/components/viz/Markdown';
import FullScreenMarkdownEditor from '@/components/viz/FullScreenMarkdownEditor';

const Syllabus: React.FC = () => {
  const exampleMd = `# 课程大纲\n\n## 课程目标\n\n简要描述课程目标。\n\n## 按周计划\n\n- 第1周：课程导论与学习地图\n- 第2周：核心概念与术语框架\n- 第3周：关键方法与工具链\n`;
  const [md, setMd] = useState(exampleMd);
  const [openFull, setOpenFull] = useState(false);

  return (
    <div>
      <PageHeader title="大纲设计" />

      <div className={shared.content}>
        <div className={styles.headerRow}>
          <div className={styles.leftTitle}>当前大纲：课程大纲设计</div>
          <div className={styles.rightAction}>
            <ExportDropdown />
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
                <Markdown value={md} />
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
          <FullScreenMarkdownEditor
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

export default Syllabus;
