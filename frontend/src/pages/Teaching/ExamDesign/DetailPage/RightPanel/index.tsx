import React, { useState } from "react";
import Dialog from "@/feature/ChatDialog";
import Button from "@/ui/Button";

export type RecItem = {
  id: string;
  tags: string[];
  stem: string;
};

type RightPanelProps = {
  recommendActive: boolean;
  typeSummary: string;
  difficultySummary: string;
  knowledgeEntries: Array<[string, number]>;
  dialogId: string;
  recList: RecItem[];
  onShuffleRecs: () => void;
  onReplaceSelected: (stem: string) => void;
};

const RightPanel: React.FC<RightPanelProps> = ({
  recommendActive,
  typeSummary,
  difficultySummary,
  knowledgeEntries,
  dialogId,
  recList,
  onShuffleRecs,
  onReplaceSelected,
}) => {
  const [recsCollapsed, setRecsCollapsed] = useState(false);

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col">
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      <div className="relative flex-1 min-h-0 min-w-0 overflow-y-auto rounded-xl bg-white/[0.88] p-[18px] dark:bg-white/[0.28] border-0 dark:border dark:border-white/[0.28] shadow-[0_8px_30px_rgba(120,90,200,0.14),inset_0_1px_0_rgba(255,255,255,0.74),inset_0_-1px_0_rgba(255,255,255,0.34)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(255,255,255,0.12)] backdrop-blur-[40px] backdrop-saturate-[210%]">
        <div className={`flex flex-col gap-3 transition-opacity ${recommendActive ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <div className="bg-white dark:bg-white/10 rounded-[10px] p-3 shadow-[0_1px_6px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_6px_rgba(0,0,0,0.2)] min-h-[320px]">
            <div className="font-bold mb-2 text-[var(--brand-text)] dark:text-black/85">试卷质量画像</div>

            <div className="mb-3">
              <div className="bg-[var(--brand-accent-soft)] p-3 rounded-lg flex items-center gap-3">
                <div className="text-[#666] dark:text-black/55 text-[12px]">综合评价</div>
                <div className="flex flex-col">
                  <div className="text-[var(--brand-accent)] font-bold text-[14px]">
                    可用
                  </div>
                  <div className="text-[#6b4da6] text-[12px] mt-1"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-[#666] dark:text-black/55 w-[64px]">覆盖度</div>
              <div className="flex-1">
                <div className="bg-[#efe9fb] h-2 rounded-lg overflow-hidden">
                  <div className="bg-[var(--brand-accent)] h-full rounded-lg w-[83%]" />
                </div>
              </div>
              <div className="w-[44px] text-right text-[var(--brand-accent)] font-bold">
                83%
              </div>
            </div>

            <div className="flex justify-between items-center mt-2 text-[#666] dark:text-black/55">
              <div>难度结构</div>
              <div>合理</div>
            </div>
            <div className="flex gap-[18px] text-[#666] dark:text-black/55 mt-1.5 text-[13px]">
              <div>易 30%</div>
              <div>中 50%</div>
              <div>难 20%</div>
            </div>

            <div className="flex justify-between mt-3">
              <div className="flex flex-col gap-1.5 items-start">
                <div className="text-[#666] dark:text-black/55 text-[12px]">区分度</div>
                <div className="font-bold text-[var(--brand-accent)] text-[16px]">
                  0.42
                </div>
                <div className="text-[#666] dark:text-black/55 text-[12px]">良好</div>
              </div>
              <div className="flex flex-col gap-1.5 items-start">
                <div className="text-[#666] dark:text-black/55 text-[12px]">信度</div>
                <div className="font-bold text-[var(--brand-accent)] text-[16px]">
                  0.78
                </div>
                <div className="text-[#666] dark:text-black/55 text-[12px]">可接受</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-white/10 rounded-[10px] p-3 shadow-[0_1px_6px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_6px_rgba(0,0,0,0.2)]">
            <div className="flex items-center border-b border-dashed border-[var(--brand-border)] dark:border-white/20 pb-2 mb-2.5">
              <div className="font-bold mb-2 text-[var(--brand-text)] dark:text-black/85">试卷概览</div>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex gap-3 items-start">
                <div className="min-w-[72px] text-[#666] dark:text-black/55 text-[12px]">题型分布</div>
                <div className="text-[var(--brand-text)] dark:text-black/75 text-[13px] leading-[1.6]">
                  {typeSummary}
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="min-w-[72px] text-[#666] dark:text-black/55 text-[12px]">难度分布</div>
                <div className="text-[var(--brand-text)] dark:text-black/75 text-[13px] leading-[1.6]">
                  {difficultySummary}
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="min-w-[72px] text-[#666] dark:text-black/55 text-[12px]">知识点覆盖</div>
                <div className="flex flex-wrap gap-2">
                  {knowledgeEntries.length ? (
                    knowledgeEntries.map(([label, count]) => (
                      <span
                        key={label}
                        className="bg-[var(--brand-accent-soft)] text-[#6b4da6] px-2 py-1 rounded-full text-[12px]"
                      >
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

        <div
          className={`absolute inset-[18px] bg-white dark:bg-white rounded-xl flex flex-col z-[20] transition-[opacity,transform] shadow-[0_10px_30px_rgba(16,24,40,0.14)] dark:shadow-[0_10px_30px_rgba(16,24,40,0.2)] will-change-[transform,opacity] ${!recommendActive ? "opacity-0 translate-y-[18px] pointer-events-none" : "opacity-100 translate-y-0"}`}
        >
          <div className="flex flex-col gap-3 p-0 overflow-y-auto overscroll-contain flex-1 min-h-0 pr-1">
            <div className="bg-white dark:bg-white rounded-[10px] p-3 shadow-[0_1px_6px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_6px_rgba(0,0,0,0.2)] relative shrink-0">
              <div className="flex items-center justify-between">
                <div className="font-bold text-[var(--brand-text)] dark:text-black/85">推荐变题</div>
                <div className="flex items-center gap-2">
                  {!recsCollapsed && (
                    <Button
                      className="bg-transparent border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-[16px] font-semibold transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)] active:scale-95"
                      onClick={onShuffleRecs}
                    >
                      换一换
                    </Button>
                  )}
                  <Button
                    className="bg-transparent border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-[16px] font-semibold transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)] active:scale-95"
                    onClick={() => setRecsCollapsed((prev) => !prev)}
                  >
                    {recsCollapsed ? "展开" : "收起"}
                  </Button>
                </div>
              </div>

              <div className={`flex flex-col gap-3 mt-2 overflow-hidden transition-all duration-300 ease-out ${
                recsCollapsed ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"
              }`}>
                {recList.map((r, idx) => (
                  <div
                    key={r.id}
                    className="bg-[#fbf7ff] dark:bg-[#f5f2ff] rounded-xl p-3 flex flex-col gap-3 animate-fadeSlideIn"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 text-[#888] dark:text-black/45 text-[12px]">
                        {r.tags.map((t) => (
                          <span
                            key={t}
                            className="bg-[var(--brand-accent-soft)] px-2 py-1 rounded-lg text-[#6b4da6]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <Button
                        className="bg-[var(--brand-accent)] text-white border-0 px-3 py-1.5 rounded-xl font-bold text-[13px] transition-[background,box-shadow] hover:bg-[var(--brand-accent-strong)] hover:shadow-[var(--brand-shadow)]"
                        onClick={() => onReplaceSelected(r.stem)}
                      >
                        替换
                      </Button>
                    </div>
                    <div className="text-[#222] dark:text-black/85 font-semibold mt-2">{r.stem}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="chat-dialog-shell bg-white dark:bg-white rounded-[10px] p-3 shadow-[0_1px_6px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_6px_rgba(0,0,0,0.2)] flex flex-col shrink-0 min-h-[560px]">
              <div className="h-full flex flex-col min-h-0">
                <Dialog
                  dialogId={dialogId}
                  botName="题目助手"
                  initMessage="这是本题的讨论对话。"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
