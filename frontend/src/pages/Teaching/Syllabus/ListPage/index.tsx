import React, { useEffect, useState } from "react";
import List from "@/components/List";
import ConfirmDialog from "@/components/ConfirmDialog";
import Button from "@/components/Button";
import CreateModal from "../components/CreateModal";

type Outline = {
  id: string;
  title: string;
  subtitle?: string;
  md: string;
  createdAt?: number;
};

const ListPage: React.FC<{
  items: Outline[];
  onEdit: (id?: string) => void;
  onCreate: (payload: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  openSignal?: number;
}> = ({ items, onEdit, onCreate, onDelete, onRename, openSignal }) => {
  const [open, setOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string>("");
  useEffect(() => {
    if (typeof openSignal === "number" && openSignal > 0) {
      const id = window.setTimeout(() => setOpen(true), 0);
      return () => window.clearTimeout(id);
    }
    return;
  }, [openSignal]);
  useEffect(() => {
    const onCreate = () => setOpen(true);
    window.addEventListener("syllabus-outline-create", onCreate);
    return () => window.removeEventListener("syllabus-outline-create", onCreate);
  }, []);
  return (
    <div>
      <div className="p-6 text-[#444]">
        <div className="grid grid-cols-1 gap-5 items-start">
          <div>
            <div className="bg-white/40 backdrop-blur-[16px] rounded-xl p-[18px] shadow-[0_8px_32px_rgba(147,51,234,0.12)] border border-white/40 min-h-[520px]">
              <div className="flex justify-between items-center font-bold mb-3">
                <div className="text-[var(--brand-accent)] font-bold">
                  已创建的大纲 ({items.length})
                </div>
                <div>
                  <Button
                    className="bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-xl font-semibold transition-[background,border-color,box-shadow] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]"
                    onClick={() => setOpen(true)}
                  >
                    新建大纲
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <List<Outline>
                  items={items}
                  keyExtractor={(i) => i.id}
                  editable={{ getValue: (i) => i.title }}
                  onItemClick={(item) => onEdit(item.id)}
                  renderItem={(item) => (
                    <>
                      <div className="font-bold text-[#2d1b4f]">
                        {item.title}
                      </div>
                      <div className="mt-1.5 flex gap-3 items-center">
                        {item.subtitle && (
                          <span className="text-[#888]">{item.subtitle}</span>
                        )}
                        {item.createdAt && (
                          <span className="text-[#999] text-[12px]">
                            {new Date(item.createdAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                  actions={[
                    {
                      label: "继续编辑",
                      onClick: (item) => onEdit(item.id),
                      className:
                        "bg-[var(--brand-accent)] text-white border-0 px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold hover:bg-[var(--brand-accent-strong)]",
                    },
                    {
                      label: "重命名",
                      isRename: true,
                      onClick: (item, newName?: string) =>
                        newName && onRename(item.id, newName),
                      className:
                        "bg-[var(--brand-accent-soft)] text-[var(--brand-accent)] border border-[var(--brand-border)] px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold hover:bg-[var(--brand-accent-faint)]",
                    },
                    {
                      label: "删除",
                      onClick: (item) => {
                        setConfirmDeleteId(item.id);
                        setConfirmDeleteTitle(item.title || "未命名课程");
                      },
                      className:
                        "bg-white border border-[rgba(200,30,30,0.16)] text-[#b02a37] px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold hover:bg-[#ffecec] hover:border-[#f1a1a1]",
                    },
                  ]}
                  emptyText="暂无课程大纲。"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={onCreate}
      />

      <ConfirmDialog
        open={!!confirmDeleteId}
        title="删除课程大纲"
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
      />
    </div>
  );
};

export default ListPage;
