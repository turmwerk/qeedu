import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import shared from '@/pages/shared/style.module.scss';
import styles from './style.module.scss';
import Dialog from '@/components/Dialog';

type Question = {
  id: string;
  stem: string;
  score?: number;
};

const DetailPage: React.FC<{
  examId?: string;
  title?: string;
  questions?: Question[];
  onBack: () => void;
}> = ({ examId = 'default-exam', title = '未命名试卷', questions = [], onBack }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const dialogIdFor = (questionId: string | null) => {
    if (questionId) return `${examId}-q-${questionId}`;
    return examId;
  };

  return (
    <div>
      <PageHeader title="试卷设计" />
      <div className={shared.content}>
        <div className={styles.headerRow}>
          <div className={styles.leftTitle}>当前试卷：{title}</div>
          <div className={styles.rightAction}>
            <button className={styles.backBtn} onClick={onBack}>返回试卷列表</button>
          </div>
        </div>
        <div className={styles.layout}>
          <div className={styles.leftPane}>
            <div className={styles.paperCard}>
              <div className={styles.paperHeader}>试卷</div>
              <div className={styles.paperBody}>
                {questions.length === 0 && <div className={styles.empty}>当前试卷暂无题目</div>}
                {questions.map((q) => (
                  <div key={q.id} className={styles.question} onClick={() => setSelectedQuestion(q.id)}>
                    <div className={styles.qStem}>{q.stem}</div>
                    <div className={styles.qMeta}>分值 {q.score ?? 5}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.rightPane}>
            {/* Top: 试卷质量（仅未选中题目时显示） */}
            {!selectedQuestion && (
              <div className={styles.card}>
                <div className={styles.cardTitle}>试卷质量</div>
                <div className={styles.cardBody}>覆盖度：83%  难度结构：合理  区分度：0.42  信度：0.78</div>
              </div>
            )}

            {/* Middle: 推荐提醒 */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>推荐题型</div>
              <div className={styles.cardBody}>根据试卷与所选题目推荐相似题型与替换建议。</div>
            </div>

            {/* Bottom: Dialog。dialogId 根据是否选题切换，保证对话缓存隔离 */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>{selectedQuestion ? '题目对话' : '试卷对话'}</div>
              <div className={styles.cardBody}>
                <Dialog dialogId={dialogIdFor(selectedQuestion)} botName={selectedQuestion ? '题目助手' : '试卷助手'} initMessage={selectedQuestion ? '这是本题的讨论对话。' : '欢迎使用试卷助手。'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
