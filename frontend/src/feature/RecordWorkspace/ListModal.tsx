import React, { useEffect, useMemo, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  FormOutlined,
} from "@ant-design/icons";
import ConfirmDialog from "@/ui/ConfirmDialog";
import List from "@/ui/List";
import type { ListModalProps } from "@/layouts/MainLayout/Sider/ListModal";
import WorkspaceCreateModal from "./CreateModal";
import ListHeader from "./ListHeader";
import type { WorkspaceConfig, WorkspaceRecord } from "./types";

type Props = ListModalProps & {
  config: WorkspaceConfig;
};

const WorkspaceListModal: React.FC<Props> = ({
  config,
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
  const records = items as WorkspaceRecord[];
  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"time" | "name">("time");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [filterKeys, setFilterKeys] = useState<string[]>(["all"]);
  const [searchText, setSearchText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteTitle, setConfirmDeleteTitle] = useState("");

  const sortedItems = useMemo(() => {
    const next = [...records];
    if (sortBy === "name") {
      next.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else {
      next.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    }
    if (order === "desc") next.reverse();
    return next;
  }, [order, records, sortBy]);

  const filteredItems = useMemo(() => {
    if (filterKeys.includes("all")) return sortedItems;
    return sortedItems.filter((item) =>
      config.filters.some(
        (filter) => filterKeys.includes(filter.key) && filter.match(item),
      ),
    );
  }, [config.filters, filterKeys, sortedItems]);

  const searchValue = searchText.trim().toLowerCase();
  const searchedItems = useMemo(() => {
    if (!searchValue) return filteredItems;
    return filteredItems.filter((item) => {
      const content = [
        item.title,
        item.subtitle,
        item.summary,
        item.status,
        item.tags?.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return content.includes(searchValue);
    });
  }, [filteredItems, searchValue]);

  const toggleFilter = (key: string) => {
    setFilterKeys((prev) => {
      if (key === "all") return ["all"];
      const next = prev.filter((item) => item !== "all");
      const exists = next.includes(key);
      const updated = exists ? next.filter((item) => item !== key) : [...next, key];
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
    const handleOpen = () => setOpen(true);
    window.addEventListener(config.events.create, handleOpen);
    return () => {
      window.removeEventListener(config.events.create, handleOpen);
    };
  }, [config.events.create]);

  return (
    <div>
      <div className={modalMode ? "p-2 text-[#444]" : "p-6 text-[#444]"}>
        <div className="grid grid-cols-1 gap-5 items-start">
          <div>
            <div
              className={
                modalMode
                  ? "rounded-xl p-[18px] min-h-[520px]"
                  : "rounded-xl p-[18px] min-h-[520px] bg-white/[0.58] dark:bg-white/[0.18] border-0 dark:border dark:border-white/[0.28] shadow-[0_8px_30px_rgba(120,90,200,0.14),inset_0_1px_0_rgba(255,255,255,0.74),inset_0_-1px_0_rgba(255,255,255,0.34)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(255,255,255,0.12)] backdrop-blur-[40px] backdrop-saturate-[210%]"
              }
            >
              <ListHeader
                title={config.listTitle}
                count={records.length}
                sortBy={sortBy}
                onSortChange={setSortBy}
                order={order}
                onToggleOrder={() =>
                  setOrder((value) => (value === "asc" ? "desc" : "asc"))
                }
                filters={config.filters}
                filterKeys={filterKeys}
                onToggleFilter={toggleFilter}
                onCreate={() => setOpen(true)}
                createButtonLabel={config.createButtonLabel}
                searchValue={searchText}
                onSearchChange={setSearchText}
                searchPlaceholder={config.searchPlaceholder}
                modalMode={modalMode}
                onCloseModal={onCloseModal}
              />
              <div className="p-1.5 sm:p-3">
                <List<WorkspaceRecord>
                  items={searchedItems}
                  keyExtractor={(item) => item.id}
                  hoverGlow={false}
                  defaultActionClassName="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-5 py-1.5 sm:py-2 text-[13px] sm:text-[15px] font-semibold rounded-xl select-none bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#22c55e] cursor-pointer transition-[background,border-color,transform,color] hover:bg-[#f0fdf4] dark:hover:bg-white/18 hover:border-[#bbf7d0] hover:text-[#16a34a] hover:-translate-y-[1px]"
                  editingActionClassName="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-5 py-1.5 sm:py-2 text-[13px] sm:text-[15px] font-semibold rounded-xl select-none bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#22c55e] cursor-pointer transition-[background,border-color,transform,color] hover:bg-[#f0fdf4] dark:hover:bg-white/18 hover:border-[#bbf7d0] hover:text-[#16a34a] hover:-translate-y-[1px]"
                  editable={{ getValue: (item) => item.title }}
                  onItemClick={(item) => onEdit(item.id)}
                  isItemDisabled={(item) => !!currentId && item.id === currentId}
                  itemClassName={(item) =>
                    currentId && item.id === currentId
                      ? "border-[#c7d2fe] bg-[#eef2ff]"
                      : ""
                  }
                  renderItem={(item) => (
                    <>
                      <div className="font-bold text-[var(--brand-blue)] dark:text-[#f8fbff]">
                        {item.title}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-3 items-center">
                        {item.subtitle && (
                          <span className="text-[#888] dark:text-[#d1d9e6]">{item.subtitle}</span>
                        )}
                        {item.status && (
                          <span className="rounded-full bg-[#e0f2fe] px-2 py-0.5 text-[12px] font-semibold text-[#0369a1] dark:bg-white/20 dark:text-white">
                            {item.status}
                          </span>
                        )}
                        {item.createdAt && (
                          <span className="text-[#999] text-[12px] dark:text-[#c0cadb]">
                            {new Date(item.createdAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                  actions={[
                    {
                      label: (
                        <>
                          <FormOutlined />
                          <span className="hidden sm:inline">继续编辑</span>
                        </>
                      ),
                      onClick: (item) => onEdit(item.id),
                      className:
                        "flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-5 py-1.5 sm:py-2 text-[13px] sm:text-[15px] font-semibold rounded-xl select-none bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#22c55e] cursor-pointer transition-[background,border-color,transform,color] hover:bg-[#f0fdf4] dark:hover:bg-white/18 hover:border-[#bbf7d0] hover:text-[#16a34a] hover:-translate-y-[1px]",
                    },
                    {
                      label: (
                        <>
                          <EditOutlined />
                          <span className="hidden sm:inline">重命名</span>
                        </>
                      ),
                      isRename: true,
                      onClick: (item, newName?: string) =>
                        newName && onRename(item.id, newName),
                      className:
                        "flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-5 py-1.5 sm:py-2 text-[13px] sm:text-[15px] font-semibold rounded-xl select-none bg-white dark:bg-white/10 text-[var(--brand-blue)] border border-transparent dark:border-white/[0.45] cursor-pointer transition-[background,border-color,color,transform] hover:bg-[#e8f3ff] dark:hover:bg-white/18 hover:border-[#93c5fd] hover:text-[var(--brand-blue)] hover:-translate-y-[1px]",
                    },
                    {
                      label: (
                        <>
                          <DeleteOutlined />
                          <span className="hidden sm:inline">删除</span>
                        </>
                      ),
                      onClick: (item) => {
                        setConfirmDeleteId(item.id);
                        setConfirmDeleteTitle(item.title || "未命名条目");
                      },
                      className:
                        "flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-5 py-1.5 sm:py-2 text-[13px] sm:text-[15px] font-semibold rounded-xl select-none bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#dc2626] cursor-pointer transition-[background,border-color,color,transform] hover:bg-[#fef2f2] dark:hover:bg-white/18 hover:border-[#fecaca] hover:text-[#b91c1c] hover:-translate-y-[1px]",
                    },
                  ]}
                  emptyText={config.listEmptyText}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <WorkspaceCreateModal
        config={config}
        open={open}
        onClose={() => setOpen(false)}
        onCreate={onCreate}
      />

      <ConfirmDialog
        open={!!confirmDeleteId}
        title={`删除${config.listTitle}`}
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

export const createWorkspaceListModalComponent = (config: WorkspaceConfig) => {
  const Component: React.FC<ListModalProps> = (props) => (
    <WorkspaceListModal config={config} {...props} />
  );
  Component.displayName = `${config.key}ListModal`;
  return Component;
};

export default WorkspaceListModal;

