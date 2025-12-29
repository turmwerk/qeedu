import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import shared from '@/pages/shared/style.module.scss';
import styles from './style.module.scss';
import Dialog from '@/components/Dialog';
import Dropdown from '@/components/Dropdown';
import Form from '@/components/Form';
import ToastContainer, { showToast } from '@/components/Toast';
import { downloadMarkdown, downloadDocx, exportPdfViaPrint } from '@/utils/exportFiles';

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

  const [localQuestions, setLocalQuestions] = useState<Question[]>(questions);
  useEffect(() => setLocalQuestions(questions), [questions]);

  // insert modal state
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [insertAt, setInsertAt] = useState<number | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [modalStem, setModalStem] = useState('');
  const [modalScore, setModalScore] = useState<number>(5);
  const [modalKnowledge, setModalKnowledge] = useState('');
  const [modalQType, setModalQType] = useState('简答');
  const [modalDifficulty, setModalDifficulty] = useState('中等');
  const [modalCognition, setModalCognition] = useState('理解');

  useEffect(() => {
    if (!showInsertModal) return;
    if (editingQuestionId) {
      const q = localQuestions.find(x => x.id === editingQuestionId);
      setModalStem(q?.stem || '');
      setModalScore(q?.score ?? 5);
    } else {
      setModalStem('');
      setModalScore(5);
    }
  }, [showInsertModal, editingQuestionId, localQuestions]);

  const handleModalSubmit = () => {
    const newQ: Question = { id: Date.now().toString(), stem: modalStem, score: modalScore };
    setLocalQuestions(prev => {
      if (editingQuestionId) {
        return prev.map(p => p.id === editingQuestionId ? { ...p, stem: modalStem, score: modalScore } : p);
      }
      if (insertAt == null) return [...prev, newQ];
      const idx = Math.max(0, Math.min(insertAt + 1, prev.length));
      const copy = [...prev];
      copy.splice(idx, 0, newQ);
      return copy;
    });
    setShowInsertModal(false);
    setEditingQuestionId(null);
    setInsertAt(null);
  };

  const examContent = JSON.stringify({ title, questions: localQuestions }, null, 2);

  const initialRecs = [
    { id: 'r1', tags: ['数据结构', '困难', '选择'], stem: '红黑树中，红色节点的子节点必须是？' },
    { id: 'r2', tags: ['数据结构', '简单', '选择'], stem: '栈的特点是？' }
  ];
  const altRecs = [
    { id: 'r3', tags: ['算法', '中等', '填空'], stem: '二分查找的前提是什么？' },
    { id: 'r4', tags: ['数据库', '简单', '选择'], stem: 'SQL 中用于筛选的关键字是？' }
  ];

  const [recList, setRecList] = useState(initialRecs);

  return (
    <div>
      <ToastContainer />
      <PageHeader title="试卷设计" />
      <div className={shared.content}>
        <div className={styles.headerCard}>
          <div className={styles.headerRow}>
            <div className={styles.titleBox}>
              <div className={styles.leftTitle}>当前试卷：{title}</div>
            </div>
            <div className={styles.rightAction}>
              <div className={styles.scoreBox}>
                <div className={styles.scoreLabel}>总分</div>
                <div className={styles.scoreValue}>90</div>
              </div>
              <button className={styles.backBtn} onClick={onBack}>返回试卷列表</button>
              <Dropdown
                button="导出"
                items={[
                  { label: '导出 PDF', onClick: () => exportPdfViaPrint(title || 'exam', examContent) },
                  { label: '导出 Docx', onClick: () => downloadDocx(title || 'exam', examContent) },
                  { label: '导出 Markdown', onClick: () => downloadMarkdown(title || 'exam', examContent) }
                ]}
              />
            </div>
          </div>
        </div>
        <div className={styles.layout}>
          <div className={styles.leftPane}>
            <div className={styles.paperCard}>
              <div className={styles.paperHeader}>试卷</div>
              <div className={styles.paperBody}>
                {localQuestions.length === 0 && <div className={styles.empty}>当前试卷暂无题目</div>}
                {localQuestions.map((q, idx) => (
                  <div key={q.id}>
                    <div
                      className={
                        selectedQuestion === q.id ? `${styles.question} ${styles.selected}` : styles.question
                      }
                      onClick={() => setSelectedQuestion(prev => prev === q.id ? null : q.id)}
                    >
                      <div className={styles.qLeft}>
                        <div className={styles.qIndex}>#{idx + 1}</div>
                        <div className={styles.qTags}>数据结构 中等 选择</div>
                      </div>
                      <div className={styles.qContent}>
                        <div className={styles.qStem}>{q.stem}</div>
                        <div className={styles.qActions} onClick={e => e.stopPropagation()}>
                          <div className={styles.qMeta}>分值 <input type="number" value={q.score ?? 5} onChange={(e) => {
                            const v = Number(e.target.value || 0);
                            setLocalQuestions(prev => prev.map(p => p.id === q.id ? { ...p, score: v } : p));
                          }} className={styles.scoreInput} /></div>
                          <button className={styles.modifyBtn} onClick={() => { setEditingQuestionId(q.id); setInsertAt(idx - 1); setShowInsertModal(true); }}>修改</button>
                          <button className={styles.deleteBtn} onClick={() => { setLocalQuestions(prev => prev.filter(p => p.id !== q.id)); if (selectedQuestion === q.id) setSelectedQuestion(null); }}>删除</button>
                        </div>
                      </div>
                    </div>

                    {selectedQuestion === q.id && (
                      <div className={styles.analysisWrap}>
                        <div className={styles.analysisBox}>
                          <div className={styles.analysisTitle}>知识点分析</div>
                          <div className={styles.analysisContent}>当前题目覆盖「数据库」，建议搭配相邻知识点，扩展覆盖范围。</div>
                        </div>
                        <div className={styles.analysisBox}>
                          <div className={styles.analysisTitle}>难度分析</div>
                          <div className={styles.analysisContent}>偏基础概念，适合作为入门或热身题。</div>
                        </div>
                      </div>
                    )}

                    <div className={styles.insertWrap}>
                      <button className={styles.insertBtn} onClick={() => { setInsertAt(idx); setEditingQuestionId(null); setShowInsertModal(true); }}>+ 插入题目</button>
                    </div>
                  </div>
                ))}
                {/* 如果试卷为空，显示插入按钮 */}
                {localQuestions.length === 0 && (
                  <div className={styles.insertWrap}>
                    <button className={styles.insertBtn} onClick={() => { setInsertAt(-1); setEditingQuestionId(null); setShowInsertModal(true); }}>+ 插入题目</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.rightPane}>
            <div className={styles.aiCard}>
              {/* Top: 试卷质量（仅未选中题目时显示） */}
              {!selectedQuestion && (
                <div className={styles.qualityCard}>
                  <div className={styles.cardTitle}>试卷质量画像</div>

                  <div className={styles.qualitySummary}>
                    <div className={styles.qualityBox}>
                      <div className={styles.qualityHint}>综合评价</div>
                      <div className={styles.qualityResult}>
                        <div className={styles.qualityStatus}>可用</div>
                        <div className={styles.qualityAdvice}></div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.coverageRow}>
                    <div className={styles.coverageLabel}>覆盖度</div>
                    <div className={styles.coverageBarWrap}>
                      <div className={styles.coverageBar}><div className={styles.coverageFill} style={{ width: '83%' }} /></div>
                    </div>
                    <div className={styles.coveragePercent}>83%</div>
                  </div>

                  <div className={styles.difficultyRow}>
                    <div className={styles.diffLabel}>难度结构</div>
                    <div className={styles.diffText}>合理</div>
                  </div>
                  <div className={styles.diffPercents}>
                    <div>易 30%</div>
                    <div>中 50%</div>
                    <div>难 20%</div>
                  </div>

                  <div className={styles.metricsRow}>
                    <div className={styles.metric}>
                      <div className={styles.metricLabel}>区分度</div>
                      <div className={styles.metricValue}>0.42</div>
                      <div className={styles.metricText}>良好</div>
                    </div>
                    <div className={styles.metric}>
                      <div className={styles.metricLabel}>信度</div>
                      <div className={styles.metricValue}>0.78</div>
                      <div className={styles.metricText}>可接受</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Middle: 推荐变题 */}
              <div className={styles.recommendCard}>
                <div className={styles.cardTitle}>
                  推荐变题
                </div>
                <button
                  className={styles.switchBtn}
                  onClick={() => {
                    // 简单模拟换一换：在两个备选集中切换或打乱
                    setRecList((prev) => {
                      const isInitial = prev === initialRecs || prev[0]?.id === initialRecs[0].id;
                      return isInitial ? altRecs : initialRecs;
                    });
                  }}
                >换一换</button>

                <div className={styles.recommendList}>
                  {recList.map((r) => (
                    <div key={r.id} className={styles.recItem}>
                      <div className={styles.recHeader}>
                        <div className={styles.recTags}>
                          {r.tags.map((t) => (
                            <span key={t} className={styles.recTag}>{t}</span>
                          ))}
                        </div>
                        <button
                          className={styles.recReplaceBtn}
                          onClick={() => {
                            if (!selectedQuestion) {
                              showToast('请先在左侧试卷中选择要替换的题目');
                              return;
                            }
                            setLocalQuestions((prev) => prev.map((q) => q.id === selectedQuestion ? { ...q, stem: r.stem } : q));
                          }}
                        >替换</button>
                      </div>
                      <div className={styles.recStem}>{r.stem}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom: Dialog。dialogId 根据是否选题切换，保证对话缓存隔离 */}
              <div className={styles.card}>
                
                <div className={styles.cardBody}>
                  <Dialog dialogId={dialogIdFor(selectedQuestion)} botName={selectedQuestion ? '题目助手' : '试卷助手'} initMessage={selectedQuestion ? '这是本题的讨论对话。' : '欢迎使用试卷助手。'} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {showInsertModal && (
          <div className={styles.modalOverlay} onClick={() => setShowInsertModal(false)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <div className={styles.modalColumns}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginTop: 0 }}>{editingQuestionId ? '修改题目' : '生成插入题目'}</h3>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ marginBottom: 6 }}>题干</div>
                    <textarea value={modalStem} onChange={e => setModalStem(e.target.value)} rows={5} style={{ width: '100%' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <div style={{ marginBottom: 6 }}>知识点</div>
                      <input value={modalKnowledge} onChange={e => setModalKnowledge(e.target.value)} placeholder="例如：数据库" style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #eee' }} />
                    </div>
                    <div>
                      <div style={{ marginBottom: 6 }}>题型</div>
                      <select value={modalQType} onChange={e => setModalQType(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #eee' }}>
                        <option>简答</option>
                        <option>选择</option>
                        <option>填空</option>
                        <option>编程</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                    <div>
                      <div style={{ marginBottom: 6 }}>难度</div>
                      <select value={modalDifficulty} onChange={e => setModalDifficulty(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #eee' }}>
                        <option>简单</option>
                        <option>中等</option>
                        <option>困难</option>
                      </select>
                    </div>
                    <div>
                      <div style={{ marginBottom: 6 }}>认知层次</div>
                      <select value={modalCognition} onChange={e => setModalCognition(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #eee' }}>
                        <option>记忆</option>
                        <option>理解</option>
                        <option>应用</option>
                        <option>分析</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div style={{ width: 360, marginLeft: 16 }}>
                  <div className={styles.cardTitle}>对话记录</div>
                  <div className={styles.card} style={{ marginTop: 8 }}>
                    <div className={styles.cardBody}>
                      <Dialog dialogId={`${examId}-gen`} botName="生成助手" initMessage="在此与模型对话以协助生成题目。" />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.modalActions}>
                <button className={styles.generateBtn} onClick={() => {
                  const base = modalKnowledge ? `基于「${modalKnowledge}」` : '';
                  const gen = `${base}${modalQType}题：请描述 ${modalKnowledge || '相关'} 的核心概念。`;
                  setModalStem(gen);
                }}>生成题目</button>
                <button onClick={() => { handleModalSubmit(); }} className={styles.confirmBtn}>{editingQuestionId ? '保存修改' : '确认加入'}</button>
                <button onClick={() => setShowInsertModal(false)} className={styles.modalCloseBtn}>取消</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPage;
