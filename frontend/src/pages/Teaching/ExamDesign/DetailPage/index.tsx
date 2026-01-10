import React, { useState, useEffect, type DragEvent } from 'react';
import PageHeader from '@/components/PageHeader';
import shared from '@/pages/shared/style.module.scss';
import styles from './style.module.scss';
import Dialog from '@/components/Dialog';
import ConfirmDialog from '@/components/ConfirmDialog';
import Dropdown from '@/components/Dropdown';
import Model from '@/components/Model';
import MarkdownView from '@/components/MarkdownView';
import ToastContainer from '@/components/Toast';
import { downloadMarkdown, downloadDocx, exportPdfViaPrint } from '@/utils/exportFiles';

type Question = {
  id: string;
  stem: string;
  score?: number;
  type?: string;
  options?: string[];
  knowledge?: string;
  difficulty?: string;
  cognition?: string;
  answerAnalysis?: string;
};

const DetailPage: React.FC<{
  examId?: string;
  title?: string;
  questions?: Question[];
  onBack: () => void;
}> = ({ examId = 'default-exam', title = '未命名试卷', questions = [], onBack }) => {
  type Exam = { id: string; title: string; createdAt: number; questions: Question[] };
  const STORAGE_KEY = 'exam_design_exams_v1';

  const loadExams = (): Exam[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Exam[];
    } catch (e) {
      console.warn('loadExams failed', e);
      return [];
    }
  };

  const saveExams = (exs: Exam[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exs));
    } catch (e) {
      console.warn('saveExams failed', e);
    }
  };

  const persistExam = (nextQuestions: Question[], nextTitle?: string) => {
    try {
      const exs = loadExams();
      const idx = exs.findIndex(e => e.id === examId);
      const entry: Exam = { id: examId, title: nextTitle ?? localTitle ?? title ?? '未命名试卷', createdAt: Date.now(), questions: nextQuestions };
      if (idx >= 0) {
        exs[idx] = { ...exs[idx], title: entry.title, questions: nextQuestions };
      } else {
        exs.push(entry);
      }
      saveExams(exs);
    } catch (e) {
      console.warn('persistExam failed', e);
    }
  };

  const [localTitle, setLocalTitle] = useState(title);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [recommendMounted, setRecommendMounted] = useState(false);
  const [recommendVisible, setRecommendVisible] = useState(false);
  const [confirmState, setConfirmState] = useState<{
    title: string;
    description?: string;
    confirmText?: string;
    danger?: boolean;
    onConfirm: () => void;
  } | null>(null);

  const dialogIdFor = (questionId: string | null) => {
    if (questionId) return `${examId}-q-${questionId}`;
    return examId;
  };

  useEffect(() => {
    const duration = 320;
    let hideTimer: number | undefined;
    if (selectedQuestion) {
      setRecommendMounted(true);
      setRecommendVisible(false);
      requestAnimationFrame(() => setRecommendVisible(true));
    } else {
      setRecommendVisible(false);
      hideTimer = window.setTimeout(() => setRecommendMounted(false), duration);
    }
    return () => {
      if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, [selectedQuestion]);

  const openConfirm = (payload: {
    title: string;
    description?: string;
    confirmText?: string;
    danger?: boolean;
    onConfirm: () => void;
  }) => setConfirmState(payload);

  const [localQuestions, setLocalQuestions] = useState<Question[]>(questions);
  useEffect(() => setLocalQuestions(questions), [questions]);

  // load stored exam on mount
  useEffect(() => {
    const exs = loadExams();
    const found = exs.find(e => e.id === examId);
    if (found) {
      setLocalQuestions(found.questions || []);
      setLocalTitle(found.title || title);
    } else {
      // initialize and persist a new exam
      const newExam: Exam = { id: examId, title: title || '未命名试卷', createdAt: Date.now(), questions };
      exs.push(newExam);
      saveExams(exs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist when questions or title change
  useEffect(() => {
    const exs = loadExams();
    const idx = exs.findIndex(e => e.id === examId);
    const examEntry: Exam = { id: examId, title: localTitle || title || '未命名试卷', createdAt: Date.now(), questions: localQuestions };
    if (idx >= 0) {
      exs[idx] = { ...exs[idx], title: examEntry.title, questions: examEntry.questions };
    } else {
      exs.push(examEntry);
    }
    saveExams(exs);
  }, [localQuestions, localTitle, examId, title]);

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
  const [modalOptions, setModalOptions] = useState<string[]>([]);
  const [modalAnswerAnalysis, setModalAnswerAnalysis] = useState('');

  useEffect(() => {
    if (!showInsertModal) return;
    if (editingQuestionId) {
      const q = localQuestions.find(x => x.id === editingQuestionId);
      setModalStem(q?.stem || '');
      setModalScore(q?.score ?? 5);
      setModalKnowledge(q?.knowledge || '');
      setModalQType(q?.type || '简答');
      setModalDifficulty(q?.difficulty || '中等');
      setModalCognition(q?.cognition || '理解');
      setModalOptions(q?.options && q.options.length ? q.options.slice() : ['','']);
      setModalAnswerAnalysis(q?.answerAnalysis || '');
    } else {
      setModalStem('');
      setModalScore(5);
      setModalKnowledge('');
      setModalQType('简答');
      setModalDifficulty('中等');
      setModalCognition('理解');
      setModalOptions(['', '']);
      setModalAnswerAnalysis('');
    }
  }, [showInsertModal, editingQuestionId, localQuestions]);

  const handleModalSubmit = () => {
    const newQ: Question = {
      id: Date.now().toString(),
      stem: modalStem,
      score: modalScore,
      type: modalQType,
      options: modalOptions && modalOptions.length ? modalOptions.map(s => s.trim()).filter(Boolean) : undefined,
      knowledge: modalKnowledge,
      difficulty: modalDifficulty,
      cognition: modalCognition,
      answerAnalysis: modalAnswerAnalysis,
    };
    let nextQuestions: Question[];
    if (editingQuestionId) {
      nextQuestions = localQuestions.map(p => p.id === editingQuestionId ? { ...p, stem: modalStem, score: modalScore, type: modalQType, options: newQ.options, knowledge: modalKnowledge, difficulty: modalDifficulty, cognition: modalCognition, answerAnalysis: modalAnswerAnalysis } : p);
    } else if (insertAt == null) {
      nextQuestions = [...localQuestions, newQ];
    } else {
      const idx = Math.max(0, Math.min(insertAt + 1, localQuestions.length));
      const copy = [...localQuestions];
      copy.splice(idx, 0, newQ);
      nextQuestions = copy;
    }
    setLocalQuestions(nextQuestions);
    persistExam(nextQuestions);
    setShowInsertModal(false);
    setEditingQuestionId(null);
    setInsertAt(null);
  };

  const previewItems = localQuestions.map((q, index) => ({
    id: q.id,
    index: index + 1,
    stem: q.stem,
    score: q.score ?? 0,
    options: q.options ?? [],
  }));
  const previewTotalScore = previewItems.reduce((sum, item) => sum + item.score, 0);
  const typeCounts = localQuestions.reduce<Record<string, number>>((acc, q) => {
    const key = q.type || '未标注';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const difficultyCounts = localQuestions.reduce<Record<string, number>>((acc, q) => {
    const key = q.difficulty || '未标注';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const knowledgeCounts = localQuestions.reduce<Record<string, number>>((acc, q) => {
    const key = q.knowledge || '未标注';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const formatCounts = (counts: Record<string, number>) => {
    const entries = Object.entries(counts);
    if (entries.length === 0) return '暂无题目';
    return entries.map(([label, count]) => `${label} ×${count}`).join(' / ');
  };
  const knowledgeEntries = Object.entries(knowledgeCounts);
  const examMarkdown = (() => {
    const headerTitle = localTitle || title || '未命名试卷';
    const lines: string[] = [
      `# ${headerTitle}`,
      '',
      `- 题量：${previewItems.length}`,
      `- 总分：${previewTotalScore}`,
      '',
    ];
    if (previewItems.length === 0) {
      lines.push('暂无题目。');
      return lines.join('\n');
    }
    previewItems.forEach((item) => {
      const scoreText = item.score ? `（${item.score}分）` : '';
      lines.push(`## ${item.index}. ${item.stem}${scoreText}`);
      if (item.options.length > 0) {
        lines.push('');
        item.options.forEach((opt, optIndex) => {
          lines.push(`- ${String.fromCharCode(65 + optIndex)}. ${opt}`);
        });
      }
      lines.push('');
    });
    return lines.join('\n').trim();
  })();

  const handleDragStart = (questionId: string) => (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', questionId);
    setDraggingId(questionId);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDropOnItem = (targetId: string) => (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const sourceId = event.dataTransfer.getData('text/plain');
    if (!sourceId || sourceId === targetId) return;
    setLocalQuestions((prev) => {
      const fromIndex = prev.findIndex((item) => item.id === sourceId);
      const toIndex = prev.findIndex((item) => item.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      persistExam(next);
      return next;
    });
    setDraggingId(null);
  };

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
    <><div>
      <ToastContainer />
      <PageHeader title="试卷设计" />
      <div className={shared.content}>
        <div className={styles.headerCard}>
          <div className={styles.headerRow}>
            <input
              className={styles.titleInputLarge}
              type="text"
              value={localTitle}
              onChange={(event) => setLocalTitle(event.target.value)}
              placeholder="未命名试卷"
            />
            <div className={styles.rightAction}>
              <div className={styles.scoreBox}>
                <div className={styles.scoreLabel}>总分</div>
                <div className={styles.scoreValue}>{previewTotalScore}</div>
              </div>
              <button className={styles.backBtn} onClick={onBack}>返回试卷列表</button>
              <button className={styles.previewBtn} onClick={() => setPreviewOpen(true)}>试卷预览</button>
              <Dropdown
                button="导出"
                items={[
                  { label: '导出 PDF', onClick: () => exportPdfViaPrint(localTitle || title || 'exam', examMarkdown) },
                  { label: '导出 Docx', onClick: () => downloadDocx(localTitle || title || 'exam', examMarkdown) },
                  { label: '导出 Markdown', onClick: () => downloadMarkdown(localTitle || title || 'exam', examMarkdown) }
                ]} />
            </div>
          </div>
        </div>
        <div className={styles.layout}>
          <div className={styles.leftPane}>
            <div className={styles.paperArea}>
              <div className={styles.paperCard}>
                <div className={styles.paperHeader}>试卷</div>
                <div className={styles.paperBody}>
                  {localQuestions.length === 0 && <div className={styles.empty}>当前试卷暂无题目</div>}
                  {localQuestions.map((q, idx) => (
                    <div key={q.id} className={styles.questionStack}>
                      <div
                        className={`${styles.questionCard} ${selectedQuestion === q.id ? styles.selectedCard : ''} ${draggingId === q.id ? styles.draggingCard : ''}`}
                        onClick={() => setSelectedQuestion((prev) => (prev === q.id ? null : q.id))}
                        role="button"
                        tabIndex={0}
                        draggable
                        onDragStart={handleDragStart(q.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDrop={handleDropOnItem(q.id)}
                      >
                        <div className={styles.cardHeader}>
                          <div className={styles.cardIndex}>#{idx + 1}</div>
                          <div className={styles.cardMeta}>
                            <span>{q.knowledge || '未标注'}</span>
                            <span>{q.difficulty || '中等'}</span>
                            <span>{q.type || '简答'}</span>
                          </div>
                          <span className={styles.dragHandle} aria-hidden="true">
                            ⋮⋮
                          </span>
                        </div>
                        <div className={styles.cardStem}>
                          {q.stem}
                          {q.options && q.options.length > 0 && (
                            <ul className={styles.optionsList}>
                              {q.options.map((opt, i) => (
                                <li key={i} className={styles.optionItem}>
                                  {String.fromCharCode(65 + i)}. {opt}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className={styles.cardFooter} onClick={(e) => e.stopPropagation()}>
                          <div className={styles.cardActions}>
                            <label className={styles.scoreLabel}>
                              分值
                              <input
                                type="number"
                                value={q.score ?? 5}
                                onChange={(e) => {
                                  const v = Number(e.target.value || 0);
                                  const next = localQuestions.map((p) => p.id === q.id ? { ...p, score: v } : p
                                  );
                                  setLocalQuestions(next);
                                  persistExam(next);
                                } }
                                className={styles.scoreInput} />
                            </label>
                            <button
                              className={styles.modifyBtn}
                              onClick={() => {
                                setEditingQuestionId(q.id);
                                setInsertAt(idx - 1);
                                setShowInsertModal(true);
                              } }
                            >
                              修改
                            </button>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => {
                                openConfirm({
                                  title: '删除题目',
                                  description: '确认删除该题目吗？此操作不可恢复。',
                                  confirmText: '确认删除',
                                  danger: true,
                                  onConfirm: () => {
                                    const next = localQuestions.filter((p) => p.id !== q.id);
                                    setLocalQuestions(next);
                                    persistExam(next);
                                    if (selectedQuestion === q.id) setSelectedQuestion(null);
                                  },
                                });
                              } }
                            >
                              删除
                            </button>
                          </div>
                        </div>
                      </div>

                      {selectedQuestion === q.id && (
                        <div className={styles.analysisWrap}>
                          <div className={styles.analysisBox}>
                            <div className={styles.analysisTitle}>知识点分析</div>
                            <div className={styles.analysisContent}>
                              当前题目覆盖「数据库」，建议搭配相邻知识点，扩展覆盖范围。
                            </div>
                          </div>
                          <div className={styles.analysisBox}>
                            <div className={styles.analysisTitle}>难度分析</div>
                            <div className={styles.analysisContent}>偏基础概念，适合作为入门或热身题。</div>
                          </div>
                          <div className={styles.analysisBox}>
                            <div className={styles.analysisTitle}>答案分析</div>
                            <div className={styles.analysisContent}>{q.answerAnalysis || '暂无答案分析。'}</div>
                          </div>
                        </div>
                      )}

                      <div className={styles.insertWrap}>
                        <button
                          className={styles.insertBtn}
                          onClick={() => {
                            setInsertAt(idx);
                            setEditingQuestionId(null);
                            setShowInsertModal(true);
                          } }
                        >
                          + 插入题目
                        </button>
                      </div>
                    </div>
                  ))}
                  {/* 如果试卷为空，显示插入按钮 */}
                  {localQuestions.length === 0 && (
                    <div className={styles.insertWrap}>
                      <button
                        className={styles.insertBtn}
                        onClick={() => {
                          setInsertAt(-1);
                          setEditingQuestionId(null);
                          setShowInsertModal(true);
                        } }
                      >
                        + 插入题目
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.rightPane}>
            <div className={styles.aiCard}>
              <div className={styles.panelWrap}>
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

                <div className={styles.structureCard}>
                    <div className={styles.structureHeader}>
                      <div className={styles.cardTitle}>试卷概览</div>
                    </div>
                    <div className={styles.structureBody}>
                      <div className={styles.structureRow}>
                        <div className={styles.structureLabel}>题型分布</div>
                        <div className={styles.structureValue}>{formatCounts(typeCounts)}</div>
                      </div>
                      <div className={styles.structureRow}>
                        <div className={styles.structureLabel}>难度分布</div>
                        <div className={styles.structureValue}>{formatCounts(difficultyCounts)}</div>
                      </div>
                      <div className={styles.structureRow}>
                        <div className={styles.structureLabel}>知识点覆盖</div>
                        <div className={styles.knowledgeTags}>
                          {knowledgeEntries.length ? (
                            knowledgeEntries.map(([label, count]) => (
                              <span key={label} className={styles.knowledgeTag}>
                                {label} ×{count}
                              </span>
                            ))
                          ) : (
                            <span className={styles.knowledgeEmpty}>暂无</span>
                          )}
                        </div>
                      </div>
                    </div>
                </div>
              </div>

              {recommendMounted && (
                <div className={`${styles.recommendOverlay} ${!recommendVisible ? styles.recommendHidden : ''}`}>
                  <div className={styles.recommendWrap}>
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
                                  const next = localQuestions.map((qq) => qq.id === selectedQuestion ? { ...qq, stem: r.stem } : qq);
                                  setLocalQuestions(next);
                                  persistExam(next);
                                }}
                              >替换</button>
                            </div>
                            <div className={styles.recStem}>{r.stem}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`${styles.card} ${styles.dialogCard}`}>
                      <div className={styles.dialogBody}>
                        <Dialog
                          dialogId={dialogIdFor(selectedQuestion)}
                          botName="题目助手"
                          initMessage="这是本题的讨论对话。"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                    <select value={modalQType} onChange={e => { const v = e.target.value; setModalQType(v); if (v === '选择' && modalOptions.length < 2) setModalOptions(['', '']); } } style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #eee' }}>
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
                {modalQType === '选择' && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ marginBottom: 6 }}>选项</div>
                    {modalOptions.map((opt, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ width: 28, textAlign: 'center', fontWeight: 700 }}>{String.fromCharCode(65 + i)}</div>
                        <input value={opt} onChange={e => setModalOptions(prev => { const copy = [...prev]; copy[i] = e.target.value; return copy; })} placeholder={`选项 ${String.fromCharCode(65 + i)}`} style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #eee' }} />
                        <button
                          className={styles.deleteBtn}
                          onClick={() => {
                            openConfirm({
                              title: '删除选项',
                              description: '确认删除该选项吗？',
                              confirmText: '确认删除',
                              danger: true,
                              onConfirm: () => {
                                setModalOptions(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);
                              },
                            });
                          } }
                        >
                          删除
                        </button>
                      </div>
                    ))}
                    <div>
                      <button className={styles.insertBtn} onClick={() => setModalOptions(prev => [...prev, ''])}>+ 添加选项</button>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 8 }}>
                  <div style={{ marginBottom: 6 }}>答案分析</div>
                  <textarea value={modalAnswerAnalysis} onChange={e => setModalAnswerAnalysis(e.target.value)} rows={3} style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #eee' }} />
                </div>
              </div>
              <div style={{ width: 360, marginLeft: 16 }}>
                <div className={styles.cardTitle}>对话记录</div>
                <div className={`${styles.card} ${styles.modalDialogCard}`} style={{ marginTop: 8 }}>
                  <div className={`${styles.cardBody} ${styles.modalDialogBody}`}>
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
              } }>生成题目</button>
              <button onClick={() => { handleModalSubmit(); } } className={styles.confirmBtn}>{editingQuestionId ? '保存修改' : '确认加入'}</button>
              <button onClick={() => setShowInsertModal(false)} className={styles.modalCloseBtn}>取消</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmState}
        title={confirmState?.title}
        description={confirmState?.description}
        confirmText={confirmState?.confirmText}
        danger={confirmState?.danger}
        onCancel={() => setConfirmState(null)}
        onConfirm={() => {
          if (confirmState) confirmState.onConfirm();
          setConfirmState(null);
        }}
      />

      <Model visible={previewOpen} title="试卷预览" onClose={() => setPreviewOpen(false)}>
        <div className={styles.previewModal}>
          <MarkdownView value={examMarkdown} showControls={false} />
        </div>
      </Model>
    </div>
    </>
  );
}
export default DetailPage;
