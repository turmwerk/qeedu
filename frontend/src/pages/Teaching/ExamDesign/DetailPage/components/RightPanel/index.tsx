import React from "react";
import Dialog from "@/components/Dialog";
import Button from "@/components/Button";

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
  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="bg-white/40 backdrop-blur-[16px] rounded-xl p-[18px] shadow-[0_8px_32px_rgba(147,51,234,0.12)] border border-white/40 flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto relative">
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-[10px] p-3 shadow-[0_1px_6px_rgba(0,0,0,0.06)] min-h-[320px]">
            <div className="font-bold mb-2">试卷质量画像</div>

            <div className="mb-3">
              <div className="bg-[var(--brand-accent-soft)] p-3 rounded-lg flex items-center gap-3">
                <div className="text-[#666] text-[12px]">综合评价</div>
                <div className="flex flex-col">
                  <div className="text-[var(--brand-accent)] font-bold text-[14px]">
                    可用
                  </div>
                  <div className="text-[#6b4da6] text-[12px] mt-1"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-[#666] w-[64px]">覆盖度</div>
              <div className="flex-1">
                <div className="bg-[#efe9fb] h-2 rounded-lg overflow-hidden">
                  <div className="bg-[var(--brand-accent)] h-full rounded-lg w-[83%]" />
                </div>
              </div>
              <div className="w-[44px] text-right text-[var(--brand-accent)] font-bold">
                83%
              </div>
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
                <div className="font-bold text-[var(--brand-accent)] text-[16px]">
                  0.42
                </div>
                <div className="text-[#666] text-[12px]">良好</div>
              </div>
              <div className="flex flex-col gap-1.5 items-start">
                <div className="text-[#666] text-[12px]">信度</div>
                <div className="font-bold text-[var(--brand-accent)] text-[16px]">
                  0.78
                </div>
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
                <div className="text-[var(--brand-text)] text-[13px] leading-[1.6]">
                  {typeSummary}
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="min-w-[72px] text-[#666] text-[12px]">难度分布</div>
                <div className="text-[var(--brand-text)] text-[13px] leading-[1.6]">
                  {difficultySummary}
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="min-w-[72px] text-[#666] text-[12px]">知识点覆盖</div>
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
          className={`absolute inset-[18px] bg-white rounded-xl flex flex-col z-[2] transition-[opacity,transform] shadow-[0_6px_18px_rgba(16,24,40,0.08)] will-change-[transform,opacity] ${!recommendActive ? "opacity-0 translate-y-[18px] pointer-events-none" : "opacity-100 translate-y-0"}`}
        >
          <div className="flex flex-col gap-0 p-0 overflow-y-auto flex-1 min-h-0">
            <div className="bg-white rounded-[10px] p-3 shadow-[0_1px_6px_rgba(0,0,0,0.06)] relative">
              <div className="font-bold mb-2">推荐变题</div>
              <Button
                className="absolute top-2 right-2 bg-transparent border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-[16px] font-semibold transition-[background,border-color,box-shadow] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]"
                onClick={onShuffleRecs}
              >
                换一换
              </Button>

              <div className="flex flex-col gap-3 mt-2">
                {recList.map((r) => (
                  <div
                    key={r.id}
                    className="bg-[#fbf7ff] rounded-xl p-3 flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 text-[#888] text-[12px]">
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
                    <div className="text-[#222] font-semibold mt-2">{r.stem}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[10px] p-3 shadow-[0_1px_6px_rgba(0,0,0,0.06)] flex flex-col h-[720px] min-h-0">
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
