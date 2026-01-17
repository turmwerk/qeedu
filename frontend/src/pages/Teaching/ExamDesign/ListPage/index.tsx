import React, { useState } from "react";
import List from "@/components/List";
import Form from "@/components/Form";
import Model from "@/components/Model";
import ConfirmDialog from "@/components/ConfirmDialog";

type ExamItem = {
  id: string;
  title: string;
  subtitle?: string;
  createdAt?: number;
};

const ListPage: React.FC<{
  items: ExamItem[];
  onEdit: (id?: string) => void;
  onCreate: (payload: any) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}> = ({ items, onEdit, onCreate, onDelete, onRename }) => {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string>("");
  // DifficultyPicker with two draggable knobs controlling boundaries between easy|medium|hard
  const DifficultyPicker: React.FC<{
    value: any;
    onChange: (v: any) => void;
  }> = ({ value, onChange }) => {
    const init = value || { easy: 30, medium: 50, hard: 20 };
    // positions: p1 = easy%, p2 = easy+medium%
    const [p1, setP1] = useState<number>(init.easy);
    const [p2, setP2] = useState<number>(init.easy + init.medium);
    const barRef = React.useRef<HTMLDivElement | null>(null);
    const dragging = React.useRef<"p1" | "p2" | null>(null);

    React.useEffect(() => {
      // sync when external value changes
      const v = value || { easy: 30, medium: 50, hard: 20 };
      setP1(v.easy);
      setP2(v.easy + v.medium);
    }, [value]);

    React.useEffect(() => {
      if (!barRef.current) return;
      barRef.current.style.setProperty("--p1", String(p1));
      barRef.current.style.setProperty("--p2", String(p2));
    }, [p1, p2]);

    const clamp = (n: number, a = 0, b = 100) => Math.max(a, Math.min(b, n));

    const updateFromPositions = (np1: number, np2: number) => {
      const easy = Math.round(clamp(np1, 0, np2));
      const medium = Math.round(clamp(np2 - np1, 0, 100 - easy));
      const hard = 100 - easy - medium;
      onChange({ easy, medium, hard });
    };

    const onMove = (clientX: number) => {
      const bar = barRef.current;
      if (!bar || !dragging.current) return;
      const rect = bar.getBoundingClientRect();
      const rel = ((clientX - rect.left) / rect.width) * 100;
      if (dragging.current === "p1") {
        const np1 = clamp(rel, 0, p2 - 1);
        setP1(np1);
        updateFromPositions(np1, p2);
      } else if (dragging.current === "p2") {
        const np2 = clamp(rel, p1 + 1, 100);
        setP2(np2);
        updateFromPositions(p1, np2);
      }
    };

    React.useEffect(() => {
      const onMouseMove = (e: MouseEvent) => onMove(e.clientX);
      const onTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientX);
      const stop = () => {
        dragging.current = null;
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("mouseup", stop);
      window.addEventListener("touchend", stop);
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("mouseup", stop);
        window.removeEventListener("touchend", stop);
      };
    }, [p1, p2]);

    return (
      <div className="flex flex-col gap-1.5 py-1" data-oid="qb1sfoq">
        <style data-oid="b21zlgn">{`
          .difficulty-bar {
            position: relative;
            height: 8px;
            background: #f0e7ff;
            border-radius: 4px;
          }
          .difficulty-seg-easy { position: absolute; left: 0; top: 0; bottom: 0; width: calc(var(--p1) * 1%); background: #6b2fb1; border-radius: 4px 0 0 4px; }
          .difficulty-seg-medium { position: absolute; left: calc(var(--p1) * 1%); top: 0; bottom: 0; width: calc((var(--p2) - var(--p1)) * 1%); background: #b080ff; }
          .difficulty-seg-hard { position: absolute; left: calc(var(--p2) * 1%); top: 0; bottom: 0; right: 0; background: #e9ddff; border-radius: 0 4px 4px 0; }
          .difficulty-knob { position: absolute; top: 50%; transform: translate(-50%,-50%); width: 14px; height: 14px; border-radius: 4px; background: #fff; border: 3px solid #6b2fb1; box-shadow: 0 2px 6px rgba(0,0,0,0.12); cursor: grab; z-index: 10; }
          .difficulty-knob.p1 { left: calc(var(--p1) * 1%); }
          .difficulty-knob.p2 { left: calc(var(--p2) * 1%); }
        `}</style>
        <div
          className="px-3 py-1 rounded-lg bg-white/60 backdrop-blur-sm max-w-[400px]"
          data-oid="w:pcr.o"
        >
          <div ref={barRef} className="difficulty-bar" data-oid="3mbv1s5">
            <div className="difficulty-seg-easy" data-oid="u4bjg06" />
            <div className="difficulty-seg-medium" data-oid="t88yw7r" />
            <div className="difficulty-seg-hard" data-oid="ykna8:7" />

            <div
              onMouseDown={(e) => {
                e.preventDefault();
                dragging.current = "p1";
              }}
              onTouchStart={() => {
                dragging.current = "p1";
              }}
              className="difficulty-knob p1"
              title="拖动调整简单比例"
              data-oid="pjfm.rk"
            />

            <div
              onMouseDown={(e) => {
                e.preventDefault();
                dragging.current = "p2";
              }}
              onTouchStart={() => {
                dragging.current = "p2";
              }}
              className="difficulty-knob p2"
              title="拖动调整中等比例"
              data-oid="tsoj5lh"
            />
          </div>
        </div>

        <div className="flex gap-3 items-center" data-oid="zqv-c3y">
          <label className="text-[13px] text-[#666]" data-oid="5wo4rlh">
            简单
          </label>
          <span className="text-[14px] font-bold" data-oid="peu6za8">
            {Math.round(p1)}%
          </span>
          <div className="w-px h-3 bg-[#eee]" data-oid="1:01y8j" />
          <label className="text-[13px] text-[#666]" data-oid=":x26s_e">
            中等
          </label>
          <span className="text-[14px] font-bold" data-oid="9gv3lom">
            {Math.round(p2 - p1)}%
          </span>
          <div className="w-px h-3 bg-[#eee]" data-oid="ozldqe2" />
          <label className="text-[13px] text-[#666]" data-oid="8urqa-g">
            困难
          </label>
          <span className="text-[14px] font-bold" data-oid="wov0cbd">
            {Math.round(100 - p2)}%
          </span>
        </div>
      </div>
    );
  };
  return (
    <div data-oid="u6aq20q">
      <div className="p-6 text-[#444]" data-oid="una_80s">
        <div className="grid grid-cols-1 gap-5 items-start" data-oid="1rygtha">
          <div data-oid="75rjirz">
            <div
              className="bg-white/40 backdrop-blur-[16px] rounded-xl p-[18px] shadow-[0_8px_32px_rgba(147,51,234,0.12)] border border-white/40 min-h-[520px]"
              data-oid=".m9p1gd"
            >
              <div
                className="flex justify-between items-center font-bold mb-3"
                data-oid="9zy2etk"
              >
                <div
                  className="text-[var(--brand-accent)] font-bold"
                  data-oid="ct-hsf6"
                >
                  已创建的试卷 ({items.length})
                </div>
                <div data-oid="cat0f92">
                  <button
                    className="bg-white/60 backdrop-blur-sm border border-purple-200 text-[var(--brand-accent)] px-2.5 py-1.5 rounded-xl cursor-pointer font-semibold transition-all hover:bg-white/80 hover:border-purple-300 hover:shadow-[0_4px_16px_rgba(147,51,234,0.2)]"
                    onClick={() => setOpen(true)}
                    data-oid="g6rpkd6"
                  >
                    新建试卷
                  </button>
                </div>
              </div>
              <div className="p-3" data-oid="qx3woto">
                <List
                  items={items}
                  keyExtractor={(i: any) => i.id}
                  editable={{ getValue: (i: any) => i.title }}
                  renderItem={(item: any) => (
                    <>
                      <div
                        className="font-bold text-[#2d1b4f]"
                        data-oid="k.npzg7"
                      >
                        {item.title}
                      </div>
                      <div
                        className="mt-1.5 flex gap-3 items-center"
                        data-oid="-kd074w"
                      >
                        {item.subtitle && (
                          <span className="text-[#888]" data-oid=".dokdd-">
                            {item.subtitle}
                          </span>
                        )}
                        {item.createdAt && (
                          <span
                            className="text-[#999] text-[12px]"
                            data-oid="jzpmgij"
                          >
                            {new Date(item.createdAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                  actions={[
                    {
                      label: "继续编辑",
                      onClick: (item: any) => onEdit(item.id),
                      className:
                        "bg-[var(--brand-accent)] text-white border-0 px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold hover:bg-[var(--brand-accent-strong)]",
                    },
                    {
                      label: "重命名",
                      isRename: true,
                      onClick: (item: any, newName?: string) =>
                        newName && onRename(item.id, newName),
                      className:
                        "bg-[var(--brand-accent-soft)] text-[var(--brand-accent)] border border-[var(--brand-border)] px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold hover:bg-[var(--brand-accent-faint)]",
                    },
                    {
                      label: "删除",
                      onClick: (item: any) => {
                        setConfirmDeleteId(item.id);
                        setConfirmDeleteTitle(item.title || "未命名试卷");
                      },
                      className:
                        "bg-white border border-[rgba(200,30,30,0.16)] text-[#b02a37] px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold hover:bg-[#ffecec] hover:border-[#f1a1a1]",
                    },
                  ]}
                  emptyText="暂无试卷。"
                  data-oid="qlnfqw:"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Model
        visible={open}
        title="新建试卷"
        width={1000}
        onClose={() => setOpen(false)}
        data-oid="_deubie"
      >
        <div data-oid="wikwpdn">
          <p className="text-[#666]" data-oid="h27ntw9">
            填写试卷基本信息以便快速生成试卷初稿。
          </p>
          <div className="mt-3" data-oid="d4fqhru">
            <Form
              mode="table"
              fields={[
                {
                  name: "name",
                  label: "试卷标题",
                  placeholder: "例如： 期末考试 2025",
                  defaultValue: "未命名试卷",
                  span: 2,
                },
                {
                  name: "difficulty",
                  label: "难度预设比例",
                  defaultValue: { easy: 30, medium: 50, hard: 20 },
                  render: (value, onChange) => (
                    <DifficultyPicker
                      value={value}
                      onChange={onChange}
                      data-oid=".:se:1n"
                    />
                  ),

                  span: 2,
                },

                {
                  name: "choose_count",
                  label: "选择题数量",
                  type: "number",
                  defaultValue: 10,
                  span: 1,
                },
                {
                  name: "short_count",
                  label: "简答题数量",
                  type: "number",
                  defaultValue: 4,
                  span: 1,
                },

                {
                  name: "fill_count",
                  label: "填空题数量",
                  type: "number",
                  defaultValue: 0,
                  span: 1,
                },
                {
                  name: "program_count",
                  label: "编程题数量",
                  type: "number",
                  defaultValue: 0,
                  span: 1,
                },

                {
                  name: "essay_count",
                  label: "论述题数量",
                  type: "number",
                  defaultValue: 0,
                  span: 2,
                },

                {
                  name: "content",
                  label: "考察内容",
                  type: "textarea",
                  placeholder: "例如： 操作系统、数据库",
                  rows: 6,
                  span: 2,
                },
                {
                  name: "materials",
                  label: "相关资料",
                  type: "file",
                  multiple: true,
                  accept: ".pdf,.docx,.pptx",
                  span: 2,
                },
              ]}
              submitText="生成初稿"
              submitLoading={isCreating}
              submitLoadingText="生成中"
              submitDisabled={isCreating}
              onSubmit={(values) => {
                if (isCreating) return;
                setIsCreating(true);
                setTimeout(() => {
                  onCreate(values);
                  setOpen(false);
                  setIsCreating(false);
                }, 600);
              }}
              data-oid="ynwjjx2"
            />
          </div>
        </div>
      </Model>

      <ConfirmDialog
        open={!!confirmDeleteId}
        title="删除试卷"
        description={`确认删除「${confirmDeleteTitle}」吗？此操作不可恢复。`}
        confirmText="确认删除"
        danger
        onCancel={() => {
          setConfirmDeleteId(null);
          setConfirmDeleteTitle("");
        }}
        onConfirm={() => {
          if (confirmDeleteId) onDelete(confirmDeleteId);
          setConfirmDeleteId(null);
          setConfirmDeleteTitle("");
        }}
        data-oid="5bvg0j1"
      />
    </div>
  );
};

export default ListPage;
