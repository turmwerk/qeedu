import React, { useState, useEffect, type DragEvent } from 'react';
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
      <style>{`
        @keyframes analysisReveal {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .analysis-reveal { animation: analysisReveal 0.32s cubic-bezier(0.22, 1, 0.36, 1); }
      `}</style>
      <div className="p-6 text-[#444]">
        <div className="bg-white px-2 py-1.5 rounded-[10px] shadow-[0_1px_6px_rgba(16,24,40,0.04)] mb-3">
          <div className="flex justify-between items-center gap-2.5">
            <input
              className="flex-1 border border-transparent bg-[#f0ebf6] rounded-xl px-3 py-2 text-[18px] font-bold text-[#4b2a85] min-h-[40px] focus:outline-none focus:border-[#4b2a85] focus:shadow-[0_0_0_3px_rgba(75,42,133,0.18)]"
              type="text"
              value={localTitle}
              onChange={(event) => setLocalTitle(event.target.value)}
              placeholder="未命名试卷"
            />
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-start justify-center gap-0.5 mr-2">
                <div className="text-[12px] text-[#6b6b6b] font-semibold">总分</div>
                <div className="text-[22px] font-extrabold text-[#4b2a85] leading-none">{previewTotalScore}</div>
              </div>
              <button className="bg-white border-2 border-[#7a54c4] text-[#7a54c4] px-3 py-1.5 rounded-xl cursor-pointer font-bold text-[14px] transition-[background,box-shadow,transform] hover:bg-[#f3eefb] hover:shadow-[0_8px_18px_rgba(75,42,133,0.12)] hover:-translate-y-[1px]" onClick={onBack}>返回试卷列表</button>
              <button className="bg-white border-2 border-[#7a54c4] text-[#7a54c4] px-3 py-1.5 rounded-xl cursor-pointer font-bold text-[14px] transition-[background,box-shadow,transform] hover:bg-[#f3eefb] hover:shadow-[0_8px_18px_rgba(75,42,133,0.12)] hover:-translate-y-[1px]" onClick={() => setPreviewOpen(true)}>试卷预览</button>
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
        <div className="grid grid-cols-[1fr_360px] gap-5 items-start max-[980px]:grid-cols-1">
          <div>
            <div className="flex flex-col gap-3">
              <div className="bg-white rounded-xl shadow-[0_6px_18px_rgba(16,24,40,0.06)] p-3 min-h-[640px] max-h-[640px] overflow-y-auto">
                <div className="font-bold mb-2.5 text-[var(--brand-text)]">试卷</div>
                <div className="flex flex-col gap-3">
                  {localQuestions.length === 0 && <div className="text-[#999] p-5 text-center">当前试卷暂无题目</div>}
                  {localQuestions.map((q, idx) => (
                    <div key={q.id} className="flex flex-col gap-2.5">
                      <div
                        className={`bg-white rounded-[14px] border border-[rgba(75,42,133,0.1)] shadow-[0_8px_18px_rgba(16,24,40,0.06)] p-3 flex flex-col gap-2.5 cursor-grab transition-[transform,box-shadow,border-color] relative hover:-translate-y-[1px] hover:shadow-[0_12px_24px_rgba(75,42,133,0.12)] hover:border-[rgba(75,42,133,0.2)] ${selectedQuestion === q.id ? 'border-[rgba(75,42,133,0.3)] shadow-[0_0_0_3px_rgba(123,59,232,0.12)]' : ''} ${draggingId === q.id ? 'opacity-65 scale-[0.98]' : ''}`}
                        onClick={() => setSelectedQuestion((prev) => (prev === q.id ? null : q.id))}
                        draggable
                        onDragStart={handleDragStart(q.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDrop={handleDropOnItem(q.id)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-bold text-[var(--brand-accent)]">#{idx + 1}</div>
                          <div className="flex flex-wrap gap-1.5 text-[#6b4da6] text-[12px] flex-1">
                            <span className="bg-[var(--brand-accent-soft)] px-2 py-0.5 rounded-full">{q.knowledge || '未标注'}</span>
                            <span className="bg-[var(--brand-accent-soft)] px-2 py-0.5 rounded-full">{q.difficulty || '中等'}</span>
                            <span className="bg-[var(--brand-accent-soft)] px-2 py-0.5 rounded-full">{q.type || '简答'}</span>
                          </div>
                          <span className="text-[16px] text-[rgba(75,42,133,0.5)] tracking-[1px]" aria-hidden="true">
                            ⋮⋮
                          </span>
                        </div>
                        <div className="text-[#2a2038] leading-[1.6] text-[14px]">
                          {q.stem}
                          {q.options && q.options.length > 0 && (
                            <ul className="mt-2 list-none p-0">
                              {q.options.map((opt, i) => (
                                <li key={i} className="p-1.5 rounded-lg bg-white border border-[rgba(0,0,0,0.03)] mb-1.5">
                                  {String.fromCharCode(65 + i)}. {opt}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="flex items-center justify-end gap-2.5 flex-wrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-2 items-center">
                            <label className="flex items-center gap-1.5 text-[#666] text-[13px]">
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
                                className="w-[64px] px-1.5 py-1 rounded-md border border-[#eee]" />
                            </label>
                            <button
                              className="bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-2 py-1.5 rounded-lg cursor-pointer transition-[background,border-color,box-shadow] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]"
                              onClick={() => {
                                setEditingQuestionId(q.id);
                                setInsertAt(idx - 1);
                                setShowInsertModal(true);
                              } }
                            >
                              修改
                            </button>
                            <button
                              className="bg-white border border-[rgba(200,30,30,0.16)] text-[#c21e1e] px-2 py-1.5 rounded-lg cursor-pointer transition-[background,border-color,box-shadow] hover:bg-[#fff1f2] hover:border-[rgba(200,30,30,0.35)] hover:shadow-[0_8px_18px_rgba(200,30,30,0.15)]"
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
                        <div className="analysis-reveal flex flex-col gap-2.5 my-2">
                          <div className="bg-white rounded-xl p-3.5 border border-[rgba(123,59,232,0.08)] shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
                            <div className="font-bold text-[#2b1650] mb-2">知识点分析</div>
                            <div className="text-[#4b4b4b] text-[14px] leading-[1.6]">
                              当前题目覆盖「数据库」，建议搭配相邻知识点，扩展覆盖范围。
                            </div>
                          </div>
                          <div className="bg-white rounded-xl p-3.5 border border-[rgba(123,59,232,0.08)] shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
                            <div className="font-bold text-[#2b1650] mb-2">难度分析</div>
                            <div className="text-[#4b4b4b] text-[14px] leading-[1.6]">偏基础概念，适合作为入门或热身题。</div>
                          </div>
                          <div className="bg-white rounded-xl p-3.5 border border-[rgba(123,59,232,0.08)] shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
                            <div className="font-bold text-[#2b1650] mb-2">答案分析</div>
                            <div className="text-[#4b4b4b] text-[14px] leading-[1.6]">{q.answerAnalysis || '暂无答案分析。'}</div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-center my-1.5">
                        <button
                          className="bg-transparent border border-dashed border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1 rounded-lg cursor-pointer text-[13px] transition-[background,border-color] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)]"
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
                    <div className="flex justify-center my-1.5">
                      <button
                        className="bg-transparent border border-dashed border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1 rounded-lg cursor-pointer text-[13px] transition-[background,border-color] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)]"
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
          <div>
            <div className="bg-white rounded-xl p-[18px] shadow-[0_6px_18px_rgba(16,24,40,0.04)] min-h-[640px] max-h-[640px] flex flex-col gap-3 overflow-y-auto relative">
              <div className="flex flex-col gap-3">
                <div className="bg-white rounded-[10px] p-3 shadow-[0_1px_6px_rgba(0,0,0,0.06)] min-h-[320px]">
                    <div className="font-bold mb-2">试卷质量画像</div>

                    <div className="mb-3">
                      <div className="bg-[var(--brand-accent-soft)] p-3 rounded-lg flex items-center gap-3">
                        <div className="text-[#666] text-[12px]">综合评价</div>
                        <div className="flex flex-col">
                          <div className="text-[var(--brand-accent)] font-bold text-[14px]">可用</div>
                          <div className="text-[#6b4da6] text-[12px] mt-1"></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-[#666] w-[64px]">覆盖度</div>
                      <div className="flex-1">
                        <div className="bg-[#efe9fb] h-2 rounded-lg overflow-hidden"><div className="bg-[var(--brand-accent)] h-full rounded-lg w-[83%]" /></div>
                      </div>
                      <div className="w-[44px] text-right text-[var(--brand-accent)] font-bold">83%</div>
                    </div>

                    <div className="flex justify-between items-center mt-2 text-[#666]">
                      <div>难度结构</div>
                      <div>合理</div>
                    </div>
                    <div className="flex gap-[18px] text-[#666] mt-1.5 text-[13px]">
                      <div>易 30%</div>
                      <div>中 50%</div>
                      <div>难 20%</div>
                    </div>

                    <div className="flex justify-between mt-3">
                      <div className="flex flex-col gap-1.5 items-start">
                        <div className="text-[#666] text-[12px]">区分度</div>
                        <div className="font-bold text-[var(--brand-accent)] text-[16px]">0.42</div>
                        <div className="text-[#666] text-[12px]">良好</div>
                      </div>
                      <div className="flex flex-col gap-1.5 items-start">
                        <div className="text-[#666] text-[12px]">信度</div>
                        <div className="font-bold text-[var(--brand-accent)] text-[16px]">0.78</div>
                        <div className="text-[#666] text-[12px]">可接受</div>
                      </div>
                    </div>
                </div>

                <div className="bg-white rounded-[10px] p-3 shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center border-b border-dashed border-[var(--brand-border)] pb-2 mb-2.5">
                      <div className="font-bold mb-2">试卷概览</div>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <div className="flex gap-3 items-start">
                        <div className="min-w-[72px] text-[#666] text-[12px]">题型分布</div>
                        <div className="text-[var(--brand-text)] text-[13px] leading-[1.6]">{formatCounts(typeCounts)}</div>
                      </div>
                      <div className="flex gap-3 items-start">
                        <div className="min-w-[72px] text-[#666] text-[12px]">难度分布</div>
                        <div className="text-[var(--brand-text)] text-[13px] leading-[1.6]">{formatCounts(difficultyCounts)}</div>
                      </div>
                      <div className="flex gap-3 items-start">
                        <div className="min-w-[72px] text-[#666] text-[12px]">知识点覆盖</div>
                        <div className="flex flex-wrap gap-2">
                          {knowledgeEntries.length ? (
                            knowledgeEntries.map(([label, count]) => (
                              <span key={label} className="bg-[var(--brand-accent-soft)] text-[#6b4da6] px-2 py-1 rounded-full text-[12px]">
                                {label} ×{count}
                              </span>
                            ))
                          ) : (
                            <span className="text-[var(--brand-muted)] text-[13px]">暂无</span>
                          )}
                        </div>
                      </div>
                    </div>
                </div>
              </div>

              {recommendMounted && (
                <div className={`absolute inset-[18px] bg-white rounded-xl flex flex-col gap-3 z-[2] transition-[opacity,transform] shadow-[0_6px_18px_rgba(16,24,40,0.08)] will-change-[transform,opacity] ${!recommendVisible ? 'opacity-0 translate-y-[18px] pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                  <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-auto">
                    <div className="bg-white rounded-[10px] p-3 shadow-[0_1px_6px_rgba(0,0,0,0.06)] relative">
                      <div className="font-bold mb-2">
                        推荐变题
                      </div>
                      <button
                        className="absolute top-2 right-2 bg-transparent border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-[16px] cursor-pointer font-semibold transition-[background,border-color,box-shadow] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]"
                        onClick={() => {
                          // 简单模拟换一换：在两个备选集中切换或打乱
                          setRecList((prev) => {
                            const isInitial = prev === initialRecs || prev[0]?.id === initialRecs[0].id;
                            return isInitial ? altRecs : initialRecs;
                          });
                        }}
                      >换一换</button>

                      <div className="flex flex-col gap-3 mt-2">
                        {recList.map((r) => (
                          <div key={r.id} className="bg-[#fbf7ff] rounded-xl p-3 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                              <div className="flex gap-2 text-[#888] text-[12px]">
                                {r.tags.map((t) => (
                                  <span key={t} className="bg-[var(--brand-accent-soft)] px-2 py-1 rounded-lg text-[#6b4da6]">{t}</span>
                                ))}
                              </div>
                              <button
                                className="bg-[var(--brand-accent)] text-white border-0 px-3 py-1.5 rounded-xl cursor-pointer font-bold text-[13px] transition-[background,box-shadow] hover:bg-[var(--brand-accent-strong)] hover:shadow-[var(--brand-shadow)]"
                                onClick={() => {
                                  const next = localQuestions.map((qq) => qq.id === selectedQuestion ? { ...qq, stem: r.stem } : qq);
                                  setLocalQuestions(next);
                                  persistExam(next);
                                }}
                              >替换</button>
                            </div>
                            <div className="text-[#222] font-semibold mt-2">{r.stem}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-[10px] p-3 shadow-[0_1px_6px_rgba(0,0,0,0.06)] flex flex-col h-[360px] min-h-0">
                      <div className="h-full flex flex-col min-h-0">
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
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.35)] flex items-center justify-center z-[1200]" onClick={() => setShowInsertModal(false)}>
          <div className="w-[920px] max-w-[92%] bg-white rounded-[10px] p-[18px] shadow-[0_10px_40px_rgba(16,24,40,0.2)]" onClick={e => e.stopPropagation()}>
            <div className="flex gap-3">
              <div className="flex-1">
                <h3 className="mt-0">{editingQuestionId ? '修改题目' : '生成插入题目'}</h3>
                <div className="mb-2">
                  <div className="mb-1.5">题干</div>
                  <textarea value={modalStem} onChange={e => setModalStem(e.target.value)} rows={5} className="w-full" aria-label="题干" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="mb-1.5">知识点</div>
                    <input value={modalKnowledge} onChange={e => setModalKnowledge(e.target.value)} placeholder="例如：数据库" className="w-full p-2 rounded-lg border border-[#eee]" aria-label="知识点" />
                  </div>
                  <div>
                    <div className="mb-1.5">题型</div>
                    <select value={modalQType} onChange={e => { const v = e.target.value; setModalQType(v); if (v === '选择' && modalOptions.length < 2) setModalOptions(['', '']); } } className="w-full p-2 rounded-lg border border-[#eee]" aria-label="题型">
                      <option>简答</option>
                      <option>选择</option>
                      <option>填空</option>
                      <option>编程</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <div className="mb-1.5">难度</div>
                    <select value={modalDifficulty} onChange={e => setModalDifficulty(e.target.value)} className="w-full p-2 rounded-lg border border-[#eee]" aria-label="难度">
                      <option>简单</option>
                      <option>中等</option>
                      <option>困难</option>
                    </select>
                  </div>
                  <div>
                    <div className="mb-1.5">认知层次</div>
                    <select value={modalCognition} onChange={e => setModalCognition(e.target.value)} className="w-full p-2 rounded-lg border border-[#eee]" aria-label="认知层次">
                      <option>记忆</option>
                      <option>理解</option>
                      <option>应用</option>
                      <option>分析</option>
                    </select>
                  </div>
                </div>
                {modalQType === '选择' && (
                  <div className="mt-2">
                    <div className="mb-1.5">选项</div>
                    {modalOptions.map((opt, i) => (
                      <div key={i} className="flex gap-2 items-center mb-1.5">
                        <div className="w-7 text-center font-bold">{String.fromCharCode(65 + i)}</div>
                        <input value={opt} onChange={e => setModalOptions(prev => { const copy = [...prev]; copy[i] = e.target.value; return copy; })} placeholder={`选项 ${String.fromCharCode(65 + i)}`} className="flex-1 p-2 rounded-lg border border-[#eee]" aria-label={`选项 ${String.fromCharCode(65 + i)}`} />
                        <button
                          className="bg-white border border-[rgba(200,30,30,0.16)] text-[#c21e1e] px-2 py-1.5 rounded-lg cursor-pointer transition-[background,border-color,box-shadow] hover:bg-[#fff1f2] hover:border-[rgba(200,30,30,0.35)] hover:shadow-[0_8px_18px_rgba(200,30,30,0.15)]"
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
                      <button className="bg-transparent border border-dashed border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1 rounded-lg cursor-pointer text-[13px] transition-[background,border-color] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)]" onClick={() => setModalOptions(prev => [...prev, ''])}>+ 添加选项</button>
                    </div>
                  </div>
                )}

                <div className="mt-2">
                  <div className="mb-1.5">答案分析</div>
                  <textarea value={modalAnswerAnalysis} onChange={e => setModalAnswerAnalysis(e.target.value)} rows={3} className="w-full p-2 rounded-lg border border-[#eee]" aria-label="答案分析" />
                </div>
              </div>
              <div className="w-[360px] ml-4">
                <div className="font-bold mb-2">对话记录</div>
                <div className="bg-white rounded-[10px] p-3 shadow-[0_1px_6px_rgba(0,0,0,0.06)] flex flex-col h-[360px] mt-2">
                  <div className="flex-1 flex flex-col min-h-0 text-[#666]">
                    <Dialog dialogId={`${examId}-gen`} botName="生成助手" initMessage="在此与模型对话以协助生成题目。" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button className="bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-3 py-2 rounded-lg cursor-pointer transition-[background,border-color,box-shadow] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]" onClick={() => {
                const base = modalKnowledge ? `基于「${modalKnowledge}」` : '';
                const gen = `${base}${modalQType}题：请描述 ${modalKnowledge || '相关'} 的核心概念。`;
                setModalStem(gen);
              } }>生成题目</button>
              <button onClick={() => { handleModalSubmit(); } } className="bg-[var(--brand-accent)] text-white border-0 px-3.5 py-2 rounded-[18px] cursor-pointer shadow-[var(--brand-shadow)] transition-[background,box-shadow] hover:bg-[var(--brand-accent-strong)]">{editingQuestionId ? '保存修改' : '确认加入'}</button>
              <button onClick={() => setShowInsertModal(false)} className="bg-transparent border border-[var(--brand-border)] text-[var(--brand-accent)] px-3 py-1.5 rounded-lg cursor-pointer transition-[background,border-color,box-shadow] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]">取消</button>
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
        <div className="h-[520px] min-h-[320px] max-h-[70vh]">
          <MarkdownView value={examMarkdown} showControls={false} />
        </div>
      </Model>
    </div>
    </>
  );
}
export default DetailPage;
