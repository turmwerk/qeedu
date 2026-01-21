import React, { useEffect, useMemo, useState } from "react";
import {
  CheckOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import List from "@/components/List";
import ConfirmDialog from "@/components/ConfirmDialog";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import CreateModal from "../components/CreateModal";

type ExamItem = {
  id: string;
  title: string;
  subtitle?: string;
  createdAt?: number;
};

const ListPage: React.FC<{
  items: ExamItem[];
  onEdit: (id?: string) => void;
  onCreate: (payload: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  openSignal?: number;
}> = ({ items, onEdit, onCreate, onDelete, onRename, openSignal }) => {
  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"time" | "name">("time");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [filterKeys, setFilterKeys] = useState<Array<"all" | "final" | "mid">>([
    "all",
  ]);
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
      const hitFinal = item.title.includes("期末");
      const hitMid = item.title.includes("期中");
      return (
        (filterKeys.includes("final") && hitFinal) ||
        (filterKeys.includes("mid") && hitMid)
      );
    });
  }, [filterKeys, sortedItems]);
  const filterLabelMap: Record<"all" | "final" | "mid", string> = {
    all: "全部",
    final: "期末",
    mid: "期中",
  };
  const filterLabel = filterKeys.includes("all")
    ? filterLabelMap.all
    : filterKeys.map((key) => filterLabelMap[key]).join("、") || "全部";
  const toggleFilter = (key: "all" | "final" | "mid") => {
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
    const onCreate = () => setOpen(true);
    window.addEventListener("exam-exam-create", onCreate);
    return () => window.removeEventListener("exam-exam-create", onCreate);
  }, []);
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
                <div className="flex items-center gap-2" data-oid="cat0f92">
                  <div className="relative group">
                    <Button className="bg-white/60 backdrop-blur-sm border border-purple-200 text-[var(--brand-accent)] px-2.5 py-1.5 rounded-xl font-semibold transition-all hover:bg-white/80 hover:border-purple-300 hover:shadow-[0_4px_16px_rgba(147,51,234,0.2)]">
                      排序
                    </Button>
                    <div className="absolute right-0 top-[calc(100%+4px)] bg-white/90 backdrop-blur-[20px] rounded-xl p-2 min-w-[120px] shadow-[0_8px_32px_rgba(147,51,234,0.15)] border border-white/40 opacity-0 -translate-y-1.5 pointer-events-none z-10 flex flex-col transition-[opacity,transform] [transition:opacity_200ms_ease_500ms,transform_200ms_ease_500ms] group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-hover:[transition-delay:0ms]">
                      <Button
                        className={`bg-transparent border-0 text-left w-full px-3 py-2 rounded-lg cursor-pointer text-[#1f1f1f] hover:bg-[var(--brand-accent-soft)] flex items-center justify-between ${
                          sortBy === "time" ? "bg-purple-50" : ""
                        }`}
                        onClick={() => setSortBy("time")}
                      >
                        <span>按时间</span>
                        {sortBy === "time" && (
                          <CheckOutlined className="text-[#5b35b7]" />
                        )}
                      </Button>
                      <Button
                        className={`bg-transparent border-0 text-left w-full px-3 py-2 rounded-lg cursor-pointer text-[#1f1f1f] hover:bg-[var(--brand-accent-soft)] flex items-center justify-between ${
                          sortBy === "name" ? "bg-purple-50" : ""
                        }`}
                        onClick={() => setSortBy("name")}
                      >
                        <span>按名称</span>
                        {sortBy === "name" && (
                          <CheckOutlined className="text-[#5b35b7]" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    className="bg-white/60 backdrop-blur-sm border border-purple-200 text-[var(--brand-accent)] px-2.5 py-1.5 rounded-xl font-semibold transition-all hover:bg-white/80 hover:border-purple-300 hover:shadow-[0_4px_16px_rgba(147,51,234,0.2)]"
                    onClick={() =>
                      setOrder((value) => (value === "asc" ? "desc" : "asc"))
                    }
                    aria-label="切换排序"
                  >
                    {order === "asc" ? (
                      <SortAscendingOutlined />
                    ) : (
                      <SortDescendingOutlined />
                    )}
                  </Button>
                  <Dropdown
                    button={`筛选：${filterLabel}`}
                    items={([
                      { key: "all", label: "全部" },
                      { key: "final", label: "期末" },
                      { key: "mid", label: "期中" },
                    ] as const).map((item) => {
                      const checked =
                        filterKeys.includes("all")
                          ? item.key === "all"
                          : filterKeys.includes(item.key);
                      return {
                        label: (
                          <span className="flex items-center justify-between w-full">
                            <span>{item.label}</span>
                            {checked && <span>✓</span>}
                          </span>
                        ),
                        onClick: () => toggleFilter(item.key),
                      };
                    })}
                  />
                  <Button
                    className="bg-white/60 backdrop-blur-sm border border-purple-200 text-[var(--brand-accent)] px-2.5 py-1.5 rounded-xl font-semibold transition-all hover:bg-white/80 hover:border-purple-300 hover:shadow-[0_4px_16px_rgba(147,51,234,0.2)]"
                    onClick={() => setOpen(true)}
                    data-oid="g6rpkd6"
                  >
                    新建试卷
                  </Button>
                </div>
              </div>
              <div className="p-3" data-oid="qx3woto">
                <List<ExamItem>
                  items={filteredItems}
                  keyExtractor={(i) => i.id}
                  editable={{ getValue: (i) => i.title }}
                  onItemClick={(item) => onEdit(item.id)}
                  renderItem={(item) => (
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

      <CreateModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={onCreate}
      />

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
