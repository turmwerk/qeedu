import React, { type DragEvent } from "react";
import Button from "@/ui/Button";
import type { Question } from "../types";

type ConfirmPayload = {
  title: string;
  description?: string;
  confirmText?: string;
  danger?: boolean;
  onConfirm: () => void;
};

type QuestionListProps = {
  questions: Question[];
  selectedQuestion: string | null;
  draggingId: string | null;
  onSelect: (next: string | null) => void;
  onDragStart: (questionId: string) => (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDropOnItem: (targetId: string) => (event: DragEvent<HTMLDivElement>) => void;
  onOpenInsertModal: (payload: { at: number; editingId?: string | null }) => void;
  onOpenConfirm: (payload: ConfirmPayload) => void;
  onQuestionsChange: (next: Question[]) => void;
};

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  selectedQuestion,
  draggingId,
  onSelect,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDropOnItem,
  onOpenInsertModal,
  onOpenConfirm,
  onQuestionsChange,
}) => {
  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="flex flex-col gap-3 flex-1 min-h-0">
        <div className="rounded-xl p-3 flex-1 min-h-0 overflow-y-auto bg-white/[0.88] dark:bg-white/[0.28] border-0 dark:border dark:border-white/[0.28] shadow-[0_8px_30px_rgba(120,90,200,0.14),inset_0_1px_0_rgba(255,255,255,0.74),inset_0_-1px_0_rgba(255,255,255,0.34)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(255,255,255,0.12)] backdrop-blur-[40px] backdrop-saturate-[210%]">
          <div className="font-bold mb-2.5 text-[var(--brand-text)] dark:text-black/85">试卷</div>
          <div className="flex flex-col gap-3">
            {questions.length === 0 && (
              <div className="text-[#999] dark:text-black/35 p-5 text-center">当前试卷暂无题目</div>
            )}
            {questions.map((q, idx) => (
              <div key={q.id} className="flex flex-col gap-2.5">
                <div
                  className={`bg-white dark:bg-white/10 rounded-[14px] border border-[rgba(75,42,133,0.1)] dark:border-white/[0.15] shadow-[0_8px_18px_rgba(16,24,40,0.06)] dark:shadow-[0_8px_18px_rgba(0,0,0,0.25)] p-3 flex flex-col gap-2.5 cursor-grab transition-[transform,box-shadow,border-color] relative hover:-translate-y-[1px] hover:shadow-[0_12px_24px_rgba(75,42,133,0.12)] dark:hover:shadow-[0_12px_24px_rgba(0,0,0,0.35)] hover:border-[rgba(75,42,133,0.2)] dark:hover:border-white/[0.25] ${selectedQuestion === q.id ? "border-[rgba(75,42,133,0.3)] dark:border-white/[0.35] shadow-[0_0_0_3px_rgba(123,59,232,0.12)] dark:shadow-[0_0_0_3px_rgba(123,59,232,0.25)]" : ""} ${draggingId === q.id ? "opacity-65 scale-[0.98]" : ""}`}
                  onClick={() => onSelect(selectedQuestion === q.id ? null : q.id)}
                  draggable
                  onDragStart={onDragStart(q.id)}
                  onDragEnd={onDragEnd}
                  onDragOver={onDragOver}
                  onDrop={onDropOnItem(q.id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-[var(--brand-accent)]">#{idx + 1}</div>
                    <div className="flex flex-wrap gap-1.5 text-[#6b4da6] text-[12px] flex-1">
                      <span className="bg-[var(--brand-accent-soft)] px-2 py-0.5 rounded-full">
                        {q.knowledge || "未标注"}
                      </span>
                      <span className="bg-[var(--brand-accent-soft)] px-2 py-0.5 rounded-full">
                        {q.difficulty || "中等"}
                      </span>
                      <span className="bg-[var(--brand-accent-soft)] px-2 py-0.5 rounded-full">
                        {q.type || "简答"}
                      </span>
                    </div>
                    <span
                      className="text-[16px] text-[rgba(75,42,133,0.5)] tracking-[1px]"
                      aria-hidden="true"
                    >
                      ⋮⋮
                    </span>
                  </div>
                  <div className="text-[#2a2038] dark:text-black/75 leading-[1.6] text-[14px]">
                    {q.stem}
                    {q.options && q.options.length > 0 && (
                      <ul className="mt-2 list-none p-0">
                        {q.options.map((opt, i) => (
                          <li
                            key={i}
                            className="p-1.5 rounded-lg bg-white dark:bg-white/[0.06] border border-[rgba(0,0,0,0.03)] dark:border-white/10 mb-1.5"
                          >
                            {String.fromCharCode(65 + i)}. {opt}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div
                    className="flex items-center justify-end gap-2.5 flex-wrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex gap-2 items-center">
                      <label className="flex items-center gap-1.5 text-[#666] dark:text-black/55 text-[13px]">
                        分值
                        <input
                          type="number"
                          value={q.score ?? 5}
                          onChange={(e) => {
                            const v = Number(e.target.value || 0);
                            const next = questions.map((p) =>
                              p.id === q.id ? { ...p, score: v } : p,
                            );
                            onQuestionsChange(next);
                          }}
                          className="w-[64px] px-1.5 py-1 rounded-md border border-[#eee] dark:border-white/20 bg-transparent dark:text-black/85"
                        />
                      </label>
                      <Button
                        className="bg-white dark:bg-white/10 border border-[var(--brand-border)] dark:border-white/20 text-[var(--brand-accent)] px-2 py-1.5 rounded-lg transition-[background,border-color,box-shadow] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/[0.15] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]"
                        onClick={() => {
                          onOpenInsertModal({ at: idx - 1, editingId: q.id });
                        }}
                      >
                        修改
                      </Button>
                      <Button
                        className="bg-white dark:bg-white/10 border border-[rgba(200,30,30,0.16)] dark:border-[rgba(200,30,30,0.3)] text-[#c21e1e] dark:text-[#ff6b6b] px-2 py-1.5 rounded-lg transition-[background,border-color,box-shadow] hover:bg-[#fff1f2] dark:hover:bg-[rgba(200,30,30,0.15)] hover:border-[rgba(200,30,30,0.35)] hover:shadow-[0_8px_18px_rgba(200,30,30,0.15)]"
                        onClick={() => {
                          onOpenConfirm({
                            title: "删除题目",
                            description: "确认删除该题目吗？此操作不可恢复。",
                            confirmText: "确认删除",
                            danger: true,
                            onConfirm: () => {
                              const next = questions.filter((p) => p.id !== q.id);
                              onQuestionsChange(next);
                              if (selectedQuestion === q.id) onSelect(null);
                            },
                          });
                        }}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                </div>

                {selectedQuestion === q.id && (
                  <div className="analysis-reveal flex flex-col gap-2.5 my-2">
                    <div className="bg-white dark:bg-white/10 rounded-xl p-3.5 border border-[rgba(123,59,232,0.08)] dark:border-white/[0.12] shadow-[0_1px_6px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_6px_rgba(0,0,0,0.15)]">
                      <div className="font-bold text-[#2b1650] dark:text-black/85 mb-2">
                        知识点分析
                      </div>
                      <div className="text-[#4b4b4b] dark:text-black/65 text-[14px] leading-[1.6]">
                        当前题目覆盖「数据库」，建议搭配相邻知识点，扩展覆盖范围。
                      </div>
                    </div>
                    <div className="bg-white dark:bg-white/10 rounded-xl p-3.5 border border-[rgba(123,59,232,0.08)] dark:border-white/[0.12] shadow-[0_1px_6px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_6px_rgba(0,0,0,0.15)]">
                      <div className="font-bold text-[#2b1650] dark:text-black/85 mb-2">
                        难度分析
                      </div>
                      <div className="text-[#4b4b4b] dark:text-black/65 text-[14px] leading-[1.6]">
                        偏基础概念，适合作为入门或热身题。
                      </div>
                    </div>
                    <div className="bg-white dark:bg-white/10 rounded-xl p-3.5 border border-[rgba(123,59,232,0.08)] dark:border-white/[0.12] shadow-[0_1px_6px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_6px_rgba(0,0,0,0.15)]">
                      <div className="font-bold text-[#2b1650] dark:text-black/85 mb-2">
                        答案分析
                      </div>
                      <div className="text-[#4b4b4b] dark:text-black/65 text-[14px] leading-[1.6]">
                        {q.answerAnalysis || "暂无答案分析。"}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-center my-1.5">
                  <Button
                    className="bg-transparent border border-dashed border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1 rounded-lg text-[13px] transition-[background,border-color] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)]"
                    onClick={() => {
                      onOpenInsertModal({ at: idx, editingId: null });
                    }}
                  >
                    + 插入题目
                  </Button>
                </div>
              </div>
            ))}
            {questions.length === 0 && (
              <div className="flex justify-center my-1.5">
                <Button
                  className="bg-transparent border border-dashed border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1 rounded-lg text-[13px] transition-[background,border-color] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)]"
                  onClick={() => {
                    onOpenInsertModal({ at: -1, editingId: null });
                  }}
                >
                  + 插入题目
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
