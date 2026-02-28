import React, { useMemo, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  FormOutlined,
  PlusOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import List from "@/components/List";
import ConfirmDialog from "@/components/ConfirmDialog";
import Modal from "@/components/Modal";
import Form from "@/components/Form";
import type { FormField } from "@/components/Form";
import Dropdown from "@/components/Dropdown";
import SearchBar from "@/pages/Teaching/Syllabus/components/SearchBar";

type Project = {
  id: string;
  title: string;
  subtitle?: string;
  createdAt?: number;
};

const STORAGE_KEY = "code_tutor_projects_v1";

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Project[];
  } catch {
    // ignore
  }
  return [];
}

function saveProjects(items: Project[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

const createFields: FormField[] = [
  {
    name: "name",
    label: "项目名称",
    placeholder: "例如：Python 爬虫实战",
    span: 1,
  },
  {
    name: "language",
    label: "编程语言",
    type: "select",
    placeholder: "请选择编程语言",
    options: [
      { label: "Python", value: "Python" },
      { label: "JavaScript", value: "JavaScript" },
      { label: "TypeScript", value: "TypeScript" },
      { label: "Java", value: "Java" },
      { label: "C/C++", value: "C/C++" },
      { label: "Go", value: "Go" },
      { label: "Rust", value: "Rust" },
    ],
    span: 1,
  },
  {
    name: "difficulty",
    label: "难度等级",
    type: "select",
    placeholder: "请选择难度",
    options: [
      { label: "入门", value: "入门" },
      { label: "基础", value: "基础" },
      { label: "进阶", value: "进阶" },
      { label: "实战", value: "实战" },
    ],
    span: 1,
  },
  {
    name: "description",
    label: "项目描述",
    type: "textarea",
    placeholder: "简要描述项目目标和学习内容",
    rows: 3,
  },
];

const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Project[]>(() => loadProjects());
  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"time" | "name">("time");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [filterLangs, setFilterLangs] = useState<string[]>(["all"]);
  const [searchText, setSearchText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);

  const toggleLang = (lang: string) => {
    setFilterLangs((prev) => {
      if (lang === "all") return ["all"];
      const next = prev.filter((k) => k !== "all");
      const exists = next.includes(lang);
      const updated = exists ? next.filter((k) => k !== lang) : [...next, lang];
      return updated.length ? updated : ["all"];
    });
  };

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
    if (filterLangs.includes("all")) return sortedItems;
    return sortedItems.filter((item) => {
      const subtitle = (item.subtitle || "").toLowerCase();
      return filterLangs.some((lang) => subtitle.includes(lang.toLowerCase()));
    });
  }, [sortedItems, filterLangs]);

  const searchedItems = useMemo(() => {
    const val = searchText.trim().toLowerCase();
    if (!val) return filteredItems;
    return filteredItems.filter((item) => {
      const content = `${item.title} ${item.subtitle || ""}`.toLowerCase();
      return content.includes(val);
    });
  }, [filteredItems, searchText]);

  const handleCreate = (payload: Record<string, unknown>) => {
    if (isCreating) return;
    setIsCreating(true);
    setTimeout(() => {
      const lang = payload.language ? String(payload.language) : "";
      const diff = payload.difficulty ? String(payload.difficulty) : "";
      const subtitle = [lang, diff].filter(Boolean).join(" · ");
      const newItem: Project = {
        id: `proj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        title: String(payload.name || "未命名项目"),
        subtitle: subtitle || undefined,
        createdAt: Date.now(),
      };
      const updated = [newItem, ...items];
      setItems(updated);
      saveProjects(updated);
      setOpen(false);
      setIsCreating(false);
    }, 600);
  };

  const handleRename = (id: string, newName: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, title: newName } : item,
    );
    setItems(updated);
    saveProjects(updated);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    saveProjects(updated);
  };

  const handleNavigate = (item: Project) => {
    navigate(`/study/code-tutor/ProjectPage?proId=${item.id}`);
  };

  const sortButtonClass =
    "bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[var(--brand-blue)] h-9 min-w-9 px-3 rounded-xl text-[15px] font-semibold transition-[background,border-color,color,transform] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)] active:scale-95 flex items-center justify-center gap-1.5 select-none";
  const filterButtonClass =
    "bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[var(--brand-blue)] px-3 h-9 text-[15px] rounded-xl font-semibold transition-[background,border-color,color,transform] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)] active:scale-95 select-none flex items-center gap-1.5";
  const createButtonClass =
    "bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#22c55e] h-9 min-w-9 px-3 rounded-xl text-[15px] font-semibold transition-[background,border-color,color,transform] hover:bg-[#f0fdf4] dark:hover:bg-white/18 hover:border-[#bbf7d0] hover:text-[#16a34a] active:scale-95 flex items-center justify-center gap-1.5 select-none";

  const filterLabel = filterLangs.includes("all") ? "全部" : filterLangs.join("、");
  const LANG_OPTIONS = ["Python", "JavaScript", "TypeScript", "Java", "C/C++", "Go", "Rust"];

  return (
    <div>
      <div className="rounded-xl p-[18px] min-h-[520px] bg-white/[0.58] dark:bg-white/[0.18] border-0 dark:border dark:border-white/[0.28] shadow-[0_8px_30px_rgba(120,90,200,0.14),inset_0_1px_0_rgba(255,255,255,0.74),inset_0_-1px_0_rgba(255,255,255,0.34)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(255,255,255,0.12)] backdrop-blur-[40px] backdrop-saturate-[210%]">
            {/* Header */}
            <div className="flex justify-between items-center font-bold mb-3">
              <div className="text-[var(--brand-blue)] dark:text-white font-bold">
                我的项目 ({items.length})
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[280px]">
                  <SearchBar value={searchText} onChange={setSearchText} />
                </div>
                <Dropdown
                  button={order === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                  buttonClassName={sortButtonClass}
                  portalToBody
                  onButtonClick={() => setOrder((v) => (v === "asc" ? "desc" : "asc"))}
                  items={[
                    {
                      label: "按时间",
                      active: sortBy === "time",
                      onClick: () => setSortBy("time"),
                    },
                    {
                      label: "按名称",
                      active: sortBy === "name",
                      onClick: () => setSortBy("name"),
                    },
                  ]}
                  showCheck
                />
                <Dropdown
                  button={
                    <>
                      <FilterOutlined />
                      {`筛选：${filterLabel}`}
                    </>
                  }
                  buttonClassName={filterButtonClass}
                  portalToBody
                  items={[
                    { label: "全部", active: filterLangs.includes("all"), onClick: () => toggleLang("all") },
                    ...LANG_OPTIONS.map((lang) => ({
                      label: lang,
                      active: !filterLangs.includes("all") && filterLangs.includes(lang),
                      onClick: () => toggleLang(lang),
                    })),
                  ]}
                  showCheck
                />
                <button
                  className={createButtonClass}
                  onClick={() => setOpen(true)}
                >
                  <PlusOutlined /> 新建项目
                </button>
              </div>
            </div>

            {/* List */}
            <div className="p-3">
              <List<Project>
                items={searchedItems}
                keyExtractor={(i) => i.id}
                hoverGlow={false}
                defaultActionClassName="flex items-center gap-1.5 px-5 py-2 text-[15px] font-semibold rounded-xl select-none bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#22c55e] cursor-pointer transition-[background,border-color,transform,color] hover:bg-[#f0fdf4] dark:hover:bg-white/18 hover:border-[#bbf7d0] hover:text-[#16a34a] hover:-translate-y-[1px]"
                editingActionClassName="flex items-center gap-1.5 px-5 py-2 text-[15px] font-semibold rounded-xl select-none bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#22c55e] cursor-pointer transition-[background,border-color,transform,color] hover:bg-[#f0fdf4] dark:hover:bg-white/18 hover:border-[#bbf7d0] hover:text-[#16a34a] hover:-translate-y-[1px]"
                editable={{ getValue: (i) => i.title }}
                onItemClick={handleNavigate}
                renderItem={(item) => (
                  <>
                    <div className="teaching-list-title font-bold text-[var(--brand-blue)] dark:text-[#f8fbff]">
                      {item.title}
                    </div>
                    <div className="mt-1.5 flex gap-3 items-center">
                      {item.subtitle && (
                        <span className="teaching-list-subtitle text-[#888] dark:text-[#d1d9e6]">
                          {item.subtitle}
                        </span>
                      )}
                      {item.createdAt && (
                        <span className="teaching-list-time text-[#999] text-[12px] dark:text-[#c0cadb]">
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
                        <FormOutlined /> 进入项目
                      </>
                    ),
                    onClick: (item) => handleNavigate(item),
                    className:
                      "flex items-center gap-1.5 px-5 py-2 text-[15px] font-semibold rounded-xl select-none bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#22c55e] cursor-pointer transition-[background,border-color,transform,color] hover:bg-[#f0fdf4] dark:hover:bg-white/18 hover:border-[#bbf7d0] hover:text-[#16a34a] hover:-translate-y-[1px]",
                  },
                  {
                    label: (
                      <>
                        <EditOutlined /> 重命名
                      </>
                    ),
                    isRename: true,
                    onClick: (item, newName?: string) =>
                      newName && handleRename(item.id, newName),
                    className:
                      "flex items-center gap-1.5 px-5 py-2 text-[15px] font-semibold rounded-xl select-none bg-white dark:bg-white/10 text-[var(--brand-blue)] border border-transparent dark:border-white/[0.45] cursor-pointer transition-[background,border-color,color,transform] hover:bg-[#e8f3ff] dark:hover:bg-white/18 hover:border-[#93c5fd] hover:text-[var(--brand-blue)] hover:-translate-y-[1px]",
                  },
                  {
                    label: (
                      <>
                        <DeleteOutlined /> 删除
                      </>
                    ),
                    onClick: (item) => {
                      setConfirmDeleteId(item.id);
                      setConfirmDeleteTitle(item.title || "未命名项目");
                    },
                    className:
                      "flex items-center gap-1.5 px-5 py-2 text-[15px] font-semibold rounded-xl select-none bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#dc2626] cursor-pointer transition-[background,border-color,color,transform] hover:bg-[#fef2f2] dark:hover:bg-white/18 hover:border-[#fecaca] hover:text-[#b91c1c] hover:-translate-y-[1px]",
                  },
                ]}
                emptyText="暂无项目。点击「新建项目」开始创建。"
              />
            </div>
          </div>

      {/* Create Modal */}
      <Modal
        visible={open}
        title="新建编程项目"
        width={700}
        onClose={() => setOpen(false)}
      >
        <div>
          <Form
            mode="table"
            fields={createFields}
            submitText="创建项目"
            submitLoading={isCreating}
            submitLoadingText="创建中"
            submitDisabled={isCreating}
            onSubmit={handleCreate}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmDeleteId}
        title="删除编程项目"
        description={`确认删除「${confirmDeleteTitle}」吗？此操作不可恢复。`}
        confirmText="确认删除"
        danger
        onCancel={() => {
          setConfirmDeleteId(null);
          setConfirmDeleteTitle("");
        }}
        onConfirm={() => {
          if (confirmDeleteId) handleDelete(confirmDeleteId);
          setConfirmDeleteId(null);
          setConfirmDeleteTitle("");
        }}
      />
    </div>
  );
};

export default ProjectList;
