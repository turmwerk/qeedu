import React, { useMemo, useState } from "react";
import Modal from "@/ui/Modal";
import Form from "@/ui/Form";
import type { FormField } from "@/ui/Form";
import Header from "./Header";
import ProjectListContent from "./List";
import { CODE_TUTOR_PROJECTS_STORAGE_KEY } from "./constants";
import type { ProjectItem } from "./types";

function loadProjects(): ProjectItem[] {
  try {
    const raw = localStorage.getItem(CODE_TUTOR_PROJECTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ProjectItem[];
  } catch {
    // ignore
  }
  return [];
}

function saveProjects(items: ProjectItem[]) {
  try {
    localStorage.setItem(CODE_TUTOR_PROJECTS_STORAGE_KEY, JSON.stringify(items));
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
  const [items, setItems] = useState<ProjectItem[]>(() => loadProjects());
  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"time" | "name">("time");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [filterLangs, setFilterLangs] = useState<string[]>(["all"]);
  const [searchText, setSearchText] = useState("");
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
      const newItem: ProjectItem = {
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

  return (
    <div>
      <div className="rounded-xl p-3 sm:p-[18px] min-h-[320px] sm:min-h-[520px] bg-white/[0.58] dark:bg-white/[0.18] border-0 dark:border dark:border-white/[0.28] shadow-[0_8px_30px_rgba(120,90,200,0.14),inset_0_1px_0_rgba(255,255,255,0.74),inset_0_-1px_0_rgba(255,255,255,0.34)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(255,255,255,0.12)] backdrop-blur-[40px] backdrop-saturate-[210%]">
        <Header
          count={items.length}
          searchText={searchText}
          onSearch={setSearchText}
          sortBy={sortBy}
          order={order}
          onOrderToggle={() => setOrder((v) => (v === "asc" ? "desc" : "asc"))}
          onSortByChange={setSortBy}
          filterLangs={filterLangs}
          onFilterToggle={toggleLang}
          onCreate={() => setOpen(true)}
        />

        <ProjectListContent
          items={searchedItems}
          onRename={handleRename}
          onDelete={handleDelete}
        />
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
            submitLoadingText="创建中..."
            submitDisabled={isCreating}
            onSubmit={handleCreate}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ProjectList;