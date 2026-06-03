import React, { useCallback, useEffect, useMemo, useState, type DragEvent } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "@/ui/ConfirmDialog";
import SplitSiderLayout from "@/layouts/SplitSiderLayout";
import ToastContainer from "@/ui/Toast";
import { sendChatDialogPrompt } from "@/feature/ChatDialog/events";
import Header from "./Header";
import InsertQuestionModal from "./InsertQuestionModal";
import PreviewModal from "./PreviewModal";
import QuestionList from "./QuestionList";
import RightPanel from "./RightPanel";
import { EXAM_EVENTS, EXAM_STORAGE_KEY } from "../constants";
import type { Question } from "./types";
import type { Exam } from "../types";

const DetailPage: React.FC<{
  examId?: string;
  title?: string;
  questions?: Question[];
  onBack: () => void;
}> = ({
  examId = "default-exam",
  title = "未命名试卷",
  questions = [],
  onBack,
}) => {
  const navigate = useNavigate();

  const [localTitle, setLocalTitle] = useState(title);

  const loadExams = useCallback((): Exam[] => {
    try {
      const raw = localStorage.getItem(EXAM_STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Exam[];
    } catch (e) {
      console.warn("loadExams failed", e);
      return [];
    }
  }, []);

  const saveExams = useCallback((exs: Exam[]) => {
    try {
      localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(exs));
    } catch (e) {
      console.warn("saveExams failed", e);
    }
  }, []);

  const persistExam = useCallback((nextQuestions: Question[], nextTitle?: string) => {
    try {
      const exs = loadExams();
      const idx = exs.findIndex((e) => e.id === examId);
      const entry: Exam = {
        id: examId,
        title: nextTitle ?? localTitle ?? title ?? "未命名试卷",
        createdAt: Date.now(),
        questions: nextQuestions,
      };
      if (idx >= 0) {
        exs[idx] = {
          ...exs[idx],
          title: entry.title,
          questions: nextQuestions,
        };
      } else {
        exs.push(entry);
      }
      saveExams(exs);
      window.dispatchEvent(new Event(EXAM_EVENTS.updated));
    } catch (e) {
      console.warn("persistExam failed", e);
    }
  }, [examId, loadExams, saveExams, localTitle, title]);

  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
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

  const recommendActive = !!selectedQuestion;

  const openConfirm = (payload: {
    title: string;
    description?: string;
    confirmText?: string;
    danger?: boolean;
    onConfirm: () => void;
  }) => setConfirmState(payload);

  const [localQuestions, setLocalQuestions] = useState<Question[]>(questions);

  useEffect(() => {
    setLocalTitle(title);
    setLocalQuestions(questions);
    setSelectedQuestion(null);
    setDraggingId(null);
  }, [examId, title, questions]);

  const applyQuestions = useCallback(
    (next: Question[]) => {
      setLocalQuestions(next);
      persistExam(next);
    },
    [persistExam],
  );

  const handleTitleChange = useCallback(
    (next: string) => {
      setLocalTitle(next);
      persistExam(localQuestions, next);
    },
    [localQuestions, persistExam]
  );

  const [showInsertModal, setShowInsertModal] = useState(false);
  const [insertAt, setInsertAt] = useState<number | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [modalStem, setModalStem] = useState("");
  const [modalScore, setModalScore] = useState<number>(5);
  const [modalKnowledge, setModalKnowledge] = useState("");
  const [modalQType, setModalQType] = useState("简答");
  const [modalDifficulty, setModalDifficulty] = useState("中等");
  const [modalCognition, setModalCognition] = useState("理解");
  const [modalOptions, setModalOptions] = useState<string[]>([]);
  const [modalAnswerAnalysis, setModalAnswerAnalysis] = useState("");

  const openInsertModal = useCallback(
    (payload: { at: number | null; editingId?: string | null }) => {
      const nextId = payload.editingId ?? null;
      setInsertAt(payload.at);
      setEditingQuestionId(nextId);
      if (nextId) {
        const q = localQuestions.find((x) => x.id === nextId);
        setModalStem(q?.stem || "");
        setModalScore(q?.score ?? 5);
        setModalKnowledge(q?.knowledge || "");
        setModalQType(q?.type || "简答");
        setModalDifficulty(q?.difficulty || "中等");
        setModalCognition(q?.cognition || "理解");
        setModalOptions(
          q?.options && q.options.length ? q.options.slice() : ["", ""],
        );
        setModalAnswerAnalysis(q?.answerAnalysis || "");
      } else {
        setModalStem("");
        setModalScore(5);
        setModalKnowledge("");
        setModalQType("简答");
        setModalDifficulty("中等");
        setModalCognition("理解");
        setModalOptions(["", ""]);
        setModalAnswerAnalysis("");
      }
      setShowInsertModal(true);
    },
    [localQuestions]
  );

  const handleModalQTypeChange = useCallback(
    (nextType: string) => {
      setModalQType(nextType);
      if (nextType === "选择" && modalOptions.length < 2) {
        setModalOptions(["", ""]);
      }
    },
    [modalOptions.length],
  );

  const handleModalSubmit = () => {
    const newQ: Question = {
      id: Date.now().toString(),
      stem: modalStem,
      score: modalScore,
      type: modalQType,
      options:
        modalOptions && modalOptions.length
          ? modalOptions.map((s) => s.trim()).filter(Boolean)
          : undefined,
      knowledge: modalKnowledge,
      difficulty: modalDifficulty,
      cognition: modalCognition,
      answerAnalysis: modalAnswerAnalysis,
    };
    let nextQuestions: Question[];
    if (editingQuestionId) {
      nextQuestions = localQuestions.map((p) =>
        p.id === editingQuestionId
          ? {
              ...p,
              stem: modalStem,
              score: modalScore,
              type: modalQType,
              options: newQ.options,
              knowledge: modalKnowledge,
              difficulty: modalDifficulty,
              cognition: modalCognition,
              answerAnalysis: modalAnswerAnalysis,
            }
          : p,
      );
    } else if (insertAt == null) {
      nextQuestions = [...localQuestions, newQ];
    } else {
      const idx = Math.max(0, Math.min(insertAt + 1, localQuestions.length));
      const copy = [...localQuestions];
      copy.splice(idx, 0, newQ);
      nextQuestions = copy;
    }
    applyQuestions(nextQuestions);
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
  const previewTotalScore = previewItems.reduce(
    (sum, item) => sum + item.score,
    0,
  );
  const typeCounts = localQuestions.reduce<Record<string, number>>((acc, q) => {
    const key = q.type || "未标注";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const difficultyCounts = localQuestions.reduce<Record<string, number>>(
    (acc, q) => {
      const key = q.difficulty || "未标注";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {},
  );
  const knowledgeCounts = localQuestions.reduce<Record<string, number>>(
    (acc, q) => {
      const key = q.knowledge || "未标注";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {},
  );
  const formatCounts = (counts: Record<string, number>) => {
    const entries = Object.entries(counts);
    if (entries.length === 0) return "暂无题目";
    return entries.map(([label, count]) => `${label} ×${count}`).join(" / ");
  };
  const knowledgeEntries = Object.entries(knowledgeCounts);
  const examMarkdown = (() => {
    const headerTitle = localTitle || title || "未命名试卷";
    const lines: string[] = [
      `# ${headerTitle}`,
      "",
      `- 题量：${previewItems.length}`,
      `- 总分：${previewTotalScore}`,
      "",
    ];

    if (previewItems.length === 0) {
      lines.push("暂无题目。");
      return lines.join("\n");
    }
    previewItems.forEach((item) => {
      const scoreText = item.score ? `（${item.score}分）` : "";
      lines.push(`## ${item.index}. ${item.stem}${scoreText}`);
      if (item.options.length > 0) {
        lines.push("");
        item.options.forEach((opt, optIndex) => {
          lines.push(`- ${String.fromCharCode(65 + optIndex)}. ${opt}`);
        });
      }
      lines.push("");
    });
    return lines.join("\n").trim();
  })();

  const handleDragStart =
    (questionId: string) => (event: DragEvent<HTMLDivElement>) => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", questionId);
      setDraggingId(questionId);
    };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDropOnItem =
    (targetId: string) => (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const sourceId = event.dataTransfer.getData("text/plain");
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

  const initialRecs = useMemo(
    () => [
      {
        id: "r1",
        tags: ["数据结构", "困难", "选择"],
        stem: "红黑树中，红色节点的子节点必须是？",
      },
      { id: "r2", tags: ["数据结构", "简单", "选择"], stem: "栈的特点是？" },
    ],
    [],
  );

  const altRecs = useMemo(
    () => [
      {
        id: "r3",
        tags: ["算法", "中等", "填空"],
        stem: "二分查找的前提是什么？",
      },
      {
        id: "r4",
        tags: ["数据库", "简单", "选择"],
        stem: "SQL 中用于筛选的关键字是？",
      },
    ],
    [],
  );

  const [recList, setRecList] = useState(initialRecs);

  const handleBack = useCallback(() => {
    onBack();
    navigate("/teaching/exam/ListPage");
  }, [navigate, onBack]);

  const handleShuffleRecs = useCallback(() => {
    setRecList((prev) => {
      const isInitial = prev === initialRecs || prev[0]?.id === initialRecs[0].id;
      return isInitial ? altRecs : initialRecs;
    });
  }, [altRecs, initialRecs]);

  const handleReplaceSelected = useCallback(
    (stem: string) => {
      if (!selectedQuestion) return;
      const next = localQuestions.map((qq) =>
        qq.id === selectedQuestion ? { ...qq, stem } : qq,
      );
      applyQuestions(next);
    },
    [applyQuestions, localQuestions, selectedQuestion],
  );

  return (
    <>
      <div className="exam-detail-page h-full min-h-0 w-full overflow-hidden" data-oid="vqmja1r">
        <ToastContainer data-oid="d_rl_f6" />
        <style data-oid="ykkejm8">{`
        @keyframes analysisReveal {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .analysis-reveal { animation: analysisReveal 0.32s cubic-bezier(0.22, 1, 0.36, 1); }
      `}</style>
        <div
          className="p-0 text-[#444] h-full min-h-0 flex flex-col overflow-hidden"
          data-oid="j-6j29_"
        >
          <Header
            title={localTitle}
            totalScore={previewTotalScore}
            onTitleChange={handleTitleChange}
            onBack={handleBack}
            onPreview={() => setPreviewOpen(true)}
            examMarkdown={examMarkdown}
          />
          <SplitSiderLayout
            className="p-0 flex-1 min-h-0 h-full"
            leftClassName="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-white"
            rightClassName="flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-white"
            left={
              <QuestionList
                questions={localQuestions}
                selectedQuestion={selectedQuestion}
                draggingId={draggingId}
                onSelect={setSelectedQuestion}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDropOnItem={handleDropOnItem}
                onOpenInsertModal={openInsertModal}
                onOpenConfirm={openConfirm}
                onQuestionsChange={applyQuestions}
              />
            }
            right={
              <RightPanel
                recommendActive={recommendActive}
                typeSummary={formatCounts(typeCounts)}
                difficultySummary={formatCounts(difficultyCounts)}
                knowledgeEntries={knowledgeEntries}
                dialogId={dialogIdFor(selectedQuestion)}
                recList={recList}
                onShuffleRecs={handleShuffleRecs}
                onReplaceSelected={handleReplaceSelected}
              />
            }
            data-oid="uewgnt."
          />
        </div>
        <InsertQuestionModal
          open={showInsertModal}
          examId={examId}
          editingQuestionId={editingQuestionId}
          modalStem={modalStem}
          modalKnowledge={modalKnowledge}
          modalQType={modalQType}
          modalDifficulty={modalDifficulty}
          modalCognition={modalCognition}
          modalOptions={modalOptions}
          modalAnswerAnalysis={modalAnswerAnalysis}
          onClose={() => setShowInsertModal(false)}
          onOpenConfirm={openConfirm}
          onChangeStem={setModalStem}
          onChangeKnowledge={setModalKnowledge}
          onChangeQType={handleModalQTypeChange}
          onChangeDifficulty={setModalDifficulty}
          onChangeCognition={setModalCognition}
          onChangeOptions={setModalOptions}
          onChangeAnswerAnalysis={setModalAnswerAnalysis}
          onGenerateStem={() => {
            const base = modalKnowledge ? `基于「${modalKnowledge}」` : "";
            const gen = `${base}${modalQType}题：请描述 ${modalKnowledge || "相关"} 的核心概念。`;
            setModalStem(gen);
            sendChatDialogPrompt(
              `${examId}-gen`,
              [
                "请生成一题可直接加入当前试卷的题目，并补充答案分析。",
                `试卷：${localTitle || title || "未命名试卷"}`,
                `题型：${modalQType}`,
                `知识点：${modalKnowledge || "未指定"}`,
                `难度：${modalDifficulty}`,
                `认知层级：${modalCognition}`,
                `分值：${modalScore}`,
                `当前题干草稿：${gen}`,
                "如果是选择题，请给出 4 个选项、正确答案和解析；其他题型请给出标准答案和评分要点。",
              ].join("\n"),
            );
          }}
          onSubmit={handleModalSubmit}
        />

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
          data-oid="r6gs8je"
        />

        <PreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          markdown={examMarkdown}
        />
      </div>
    </>
  );
};

export default DetailPage;
