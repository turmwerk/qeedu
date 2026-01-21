import React, { useEffect, useMemo, useState } from "react";
import List from "@/components/List";
import ConfirmDialog from "@/components/ConfirmDialog";
import CreateModal from "../CreateModal";
import Header from "../../ListPage/components/Header";

type Outline = {
  id: string;
  title: string;
  subtitle?: string;
  md?: string;
  createdAt?: number;
};

interface Props {
  items: Outline[];
  onEdit: (id?: string) => void;
  onCreate: (payload: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  openSignal?: number;
  modalMode?: boolean;
  onCloseModal?: () => void;
  currentId?: string | null;
}

const ListModal: React.FC<Props> = ({
  items,
  onEdit,
  onCreate,
  onDelete,
  onRename,
  openSignal,
  modalMode = false,
  onCloseModal,
  currentId,
}) => {
  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"time" | "name">("time");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [filterKeys, setFilterKeys] = useState<Array<"all" | "intro" | "overview">>([
    "all",
  ]);
  const [searchText, setSearchText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string>("");

  const sortedItems = useMemo(() => {
    const next = [...items];
    if (sortBy === "name") {
      next.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else {
      next.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    }
    if (order === "desc") next.reverse();
    return next;
  }, [items, order, sortBy]);

  const filteredItems = useMemo(() => {
    if (filterKeys.includes("all")) return sortedItems;
    return sortedItems.filter((item) => {
      const hitIntro = item.title.includes("导论");
      const hitOverview = item.title.includes("概论");
      return (
        (filterKeys.includes("intro") && hitIntro) ||
        (filterKeys.includes("overview") && hitOverview)
      );
    });
  }, [filterKeys, sortedItems]);

  const searchValue = searchText.trim().toLowerCase();
  const searchedItems = useMemo(() => {
    if (!searchValue) return filteredItems;
    return filteredItems.filter((item) => {
      const content = `${item.title} ${item.subtitle || ""}`.toLowerCase();
      return content.includes(searchValue);
    });
  }, [filteredItems, searchValue]);

  const filterLabelMap: Record<"all" | "intro" | "overview", string> = {
    all: "全部",
    intro: "含“导论”",
    overview: "含“概论”",
  };
  const filterLabel = filterKeys.includes("all")
    ? filterLabelMap.all
    : filterKeys.map((key) => filterLabelMap[key]).join("、") || "全部";

  const toggleFilter = (key: "all" | "intro" | "overview") => {
    setFilterKeys((prev) => {
      if (key === "all") return ["all"];
      const next = prev.filter((k) => k !== "all");
      const exists = next.includes(key);
      const updated = exists ? next.filter((k) => k !== key) : [...next, key];
      return updated.length ? updated : ["all"];
    });
  };

  useEffect(() => {
    if (typeof openSignal === "number" && openSignal > 0) {
      const id = window.setTimeout(() => setOpen(true), 0);
      return () => window.clearTimeout(id);
    }
    return;
  }, [openSignal]);

  useEffect(() => {
    const onCreateOpen = () => setOpen(true);
    window.addEventListener("syllabus-outline-create", onCreateOpen);
    return () => window.removeEventListener("syllabus-outline-create", onCreateOpen);
  }, []);

  return (
    <div>
      <div className={modalMode ? "p-2 text-[#444]" : "p-6 text-[#444]"}>
        <div className="grid grid-cols-1 gap-5 items-start">
          <div>
            <div className="bg-white/40 backdrop-blur-[16px] rounded-xl p-[18px] shadow-[0_8px_32px_rgba(147,51,234,0.12)] border border-white/40 min-h-[520px]">
              <Header
                count={items.length}
                sortBy={sortBy}
                onSortChange={setSortBy}
                order={order}
                onToggleOrder={() =>
                  setOrder((value) => (value === "asc" ? "desc" : "asc"))
                }
                filterLabel={filterLabel}
                filterKeys={filterKeys}
                onToggleFilter={toggleFilter}
                onCreate={() => setOpen(true)}
                searchValue={searchText}
                onSearchChange={setSearchText}
                modalMode={modalMode}
                onCloseModal={onCloseModal}
              />
              <div className="p-3">
                <List<Outline>
                  items={searchedItems}
                  keyExtractor={(i) => i.id}
                  editable={{ getValue: (i) => i.title }}
                  onItemClick={(item) => onEdit(item.id)}
                  isItemDisabled={(item) => !!currentId && item.id === currentId}
                  itemClassName={(item) =>
                    currentId && item.id === currentId
                      ? "border-[#c7d2fe] bg-[#eef2ff]"
                      : ""
                  }
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
                        "bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)] hover:-translate-y-[1px]",
                    },
                    {
                      label: "重命名",
                      isRename: true,
                      onClick: (item, newName?: string) =>
                        newName && onRename(item.id, newName),
                      className:
                        "bg-[#e8f3ff] text-[#1d4ed8] border border-[#bfdbfe] px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold transition-[background,border-color,box-shadow,transform] hover:bg-[#dbeafe] hover:border-[#93c5fd] hover:shadow-[0_6px_14px_rgba(59,130,246,0.2)] hover:-translate-y-[1px]",
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

export default ListModal;
