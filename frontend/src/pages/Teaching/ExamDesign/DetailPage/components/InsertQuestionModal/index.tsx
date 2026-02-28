import React from "react";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Modal from "@/components/Modal";

type ConfirmPayload = {
  title: string;
  description?: string;
  confirmText?: string;
  danger?: boolean;
  onConfirm: () => void;
};

type InsertQuestionModalProps = {
  open: boolean;
  examId: string;
  editingQuestionId: string | null;
  modalStem: string;
  modalKnowledge: string;
  modalQType: string;
  modalDifficulty: string;
  modalCognition: string;
  modalOptions: string[];
  modalAnswerAnalysis: string;
  onClose: () => void;
  onOpenConfirm: (payload: ConfirmPayload) => void;
  onChangeStem: (value: string) => void;
  onChangeKnowledge: (value: string) => void;
  onChangeQType: (value: string) => void;
  onChangeDifficulty: (value: string) => void;
  onChangeCognition: (value: string) => void;
  onChangeOptions: (next: string[]) => void;
  onChangeAnswerAnalysis: (value: string) => void;
  onGenerateStem: () => void;
  onSubmit: () => void;
};

const InsertQuestionModal: React.FC<InsertQuestionModalProps> = ({
  open,
  examId,
  editingQuestionId,
  modalStem,
  modalKnowledge,
  modalQType,
  modalDifficulty,
  modalCognition,
  modalOptions,
  modalAnswerAnalysis,
  onClose,
  onOpenConfirm,
  onChangeStem,
  onChangeKnowledge,
  onChangeQType,
  onChangeDifficulty,
  onChangeCognition,
  onChangeOptions,
  onChangeAnswerAnalysis,
  onGenerateStem,
  onSubmit,
}) => {
  return (
    <Modal
      visible={open}
      title={editingQuestionId ? "修改题目" : "生成插入题目"}
      width={920}
      opaque
      panelClassName="!backdrop-blur-0"
      onClose={onClose}
    >
      <div className="flex gap-3">
          <div className="flex-1">
            <div className="mb-2">
              <div className="mb-1.5">题干</div>
              <textarea
                value={modalStem}
                onChange={(e) => onChangeStem(e.target.value)}
                rows={5}
                className="w-full"
                aria-label="题干"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="mb-1.5">知识点</div>
                <input
                  value={modalKnowledge}
                  onChange={(e) => onChangeKnowledge(e.target.value)}
                  placeholder="例如：数据库"
                  className="w-full p-2 rounded-lg border border-[#eee] dark:border-white/20 bg-transparent dark:text-black/85"
                  aria-label="知识点"
                />
              </div>
              <div>
                <div className="mb-1.5">题型</div>
                <select
                  value={modalQType}
                  onChange={(e) => onChangeQType(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#eee] dark:border-white/20 bg-transparent dark:text-black/85"
                  aria-label="题型"
                >
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
                <select
                  value={modalDifficulty}
                  onChange={(e) => onChangeDifficulty(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#eee] dark:border-white/20 bg-transparent dark:text-black/85"
                  aria-label="难度"
                >
                  <option>简单</option>
                  <option>中等</option>
                  <option>困难</option>
                </select>
              </div>
              <div>
                <div className="mb-1.5">认知层次</div>
                <select
                  value={modalCognition}
                  onChange={(e) => onChangeCognition(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#eee] dark:border-white/20 bg-transparent dark:text-black/85"
                  aria-label="认知层次"
                >
                  <option>记忆</option>
                  <option>理解</option>
                  <option>应用</option>
                  <option>分析</option>
                </select>
              </div>
            </div>
            {modalQType === "选择" && (
              <div className="mt-2">
                <div className="mb-1.5">选项</div>
                {modalOptions.map((opt, i) => (
                  <div key={i} className="flex gap-2 items-center mb-1.5">
                    <div className="w-7 text-center font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <input
                      value={opt}
                      onChange={(e) => {
                        const copy = [...modalOptions];
                        copy[i] = e.target.value;
                        onChangeOptions(copy);
                      }}
                      placeholder={`选项 ${String.fromCharCode(65 + i)}`}
                      className="flex-1 p-2 rounded-lg border border-[#eee] dark:border-white/20 bg-transparent dark:text-black/85"
                      aria-label={`选项 ${String.fromCharCode(65 + i)}`}
                    />

                    <Button
                      className="bg-white dark:bg-white/10 border border-[rgba(200,30,30,0.16)] dark:border-[rgba(200,30,30,0.3)] text-[#c21e1e] dark:text-[#ff6b6b] px-2 py-1.5 rounded-lg transition-[background,border-color,box-shadow] hover:bg-[#fff1f2] dark:hover:bg-[rgba(200,30,30,0.15)] hover:border-[rgba(200,30,30,0.35)] hover:shadow-[0_8px_18px_rgba(200,30,30,0.15)]"
                      onClick={() => {
                        onOpenConfirm({
                          title: "删除选项",
                          description: "确认删除该选项吗？",
                          confirmText: "确认删除",
                          danger: true,
                          onConfirm: () => {
                            if (modalOptions.length > 1) {
                              onChangeOptions(
                                modalOptions.filter((_, idx) => idx !== i),
                              );
                            }
                          },
                        });
                      }}
                    >
                      删除
                    </Button>
                  </div>
                ))}
                <div>
                  <Button
                    className="bg-transparent border border-dashed border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1 rounded-lg text-[13px] transition-[background,border-color] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)]"
                    onClick={() => onChangeOptions([...modalOptions, ""])}
                  >
                    + 添加选项
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-2">
              <div className="mb-1.5">答案分析</div>
              <textarea
                value={modalAnswerAnalysis}
                onChange={(e) => onChangeAnswerAnalysis(e.target.value)}
                rows={3}
                className="w-full p-2 rounded-lg border border-[#eee] dark:border-white/20 bg-transparent dark:text-black/85"
                aria-label="答案分析"
              />
            </div>
          </div>
          <div className="w-[360px] ml-4">
            <div className="font-bold mb-2 text-[var(--brand-text)] dark:text-black/85">对话记录</div>
            <div className="bg-white dark:bg-white/10 rounded-[10px] p-3 shadow-[0_1px_6px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_6px_rgba(0,0,0,0.2)] flex flex-col h-[360px] mt-2">
              <div className="flex-1 flex flex-col min-h-0 text-[#666] dark:text-black/55">
                <Dialog
                  dialogId={`${examId}-gen`}
                  botName="生成助手"
                  initMessage="在此与模型对话以协助生成题目。"
                />
              </div>
            </div>
          </div>
      </div>
      <div className="flex justify-end gap-2 mt-3">
          <Button
            className="bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-3 py-2 rounded-lg transition-[background,border-color,box-shadow] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]"
            onClick={onGenerateStem}
          >
            生成题目
          </Button>
          <Button
            onClick={onSubmit}
            className="bg-[var(--brand-accent)] text-white border-0 px-3.5 py-2 rounded-[18px] shadow-[var(--brand-shadow)] transition-[background,box-shadow] hover:bg-[var(--brand-accent-strong)]"
          >
            {editingQuestionId ? "保存修改" : "确认加入"}
          </Button>
          <Button
            onClick={onClose}
            className="bg-transparent border border-[var(--brand-border)] text-[var(--brand-accent)] px-3 py-1.5 rounded-lg transition-[background,border-color,box-shadow] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]"
          >
            取消
          </Button>
      </div>
    </Modal>
  );
};

export default InsertQuestionModal;
