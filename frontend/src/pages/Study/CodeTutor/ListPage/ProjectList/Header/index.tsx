import React, { useState } from "react";
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import PageHeader from "@/ui/PageHeader";
import Dropdown from "@/ui/Dropdown";
import SearchBar from "@/ui/SearchBar";

const LANG_OPTIONS = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C/C++",
  "Go",
  "Rust",
];

const sortButtonClass =
  "bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[var(--brand-blue)] h-8 min-w-8 px-2 sm:h-9 sm:min-w-9 sm:px-3 rounded-xl text-[15px] font-semibold transition-[background,border-color,color,transform] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)] active:scale-95 flex items-center justify-center gap-1.5 select-none";
const filterButtonClass =
  "bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[var(--brand-blue)] px-2 h-8 sm:px-3 sm:h-9 text-[15px] rounded-xl font-semibold transition-[background,border-color,color,transform] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)] active:scale-95 select-none flex items-center gap-1.5";
const createButtonClass =
  "bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#22c55e] h-8 min-w-8 px-2 sm:h-9 sm:min-w-9 sm:px-3 rounded-xl text-[15px] font-semibold transition-[background,border-color,color,transform] hover:bg-[#f0fdf4] dark:hover:bg-white/18 hover:border-[#bbf7d0] hover:text-[#16a34a] active:scale-95 flex items-center justify-center gap-1.5 select-none";

type Props = {
  count: number;
  searchText: string;
  onSearch: (val: string) => void;
  sortBy: "time" | "name";
  order: "asc" | "desc";
  onOrderToggle: () => void;
  onSortByChange: (val: "time" | "name") => void;
  filterLangs: string[];
  onFilterToggle: (lang: string) => void;
  onCreate: () => void;
};

const Header: React.FC<Props> = ({
  count,
  searchText,
  onSearch,
  sortBy,
  order,
  onOrderToggle,
  onSortByChange,
  filterLangs,
  onFilterToggle,
  onCreate,
}) => {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const filterLabel = filterLangs.includes("all")
    ? "全部"
    : filterLangs.join("、");

  return (
    <PageHeader
      title={
        <span className="text-[14px] sm:text-base font-bold text-[var(--brand-blue)] dark:text-white">
          项目({count})
        </span>
      }
    >
      {/* Sort / Filter / Create — hidden on mobile while search is expanded
          sm:order-2 — after search on desktop */}
      <div className={`${searchExpanded ? "hidden sm:flex" : "flex"} items-center gap-1.5 sm:gap-2 sm:order-2`}>
        {/* Sort toggle */}
        <Dropdown
          button={
            order === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />
          }
          buttonClassName={sortButtonClass}
          portalToBody
          onButtonClick={onOrderToggle}
          items={[
            {
              label: "按时间",
              active: sortBy === "time",
              onClick: () => onSortByChange("time"),
            },
            {
              label: "按名称",
              active: sortBy === "name",
              onClick: () => onSortByChange("name"),
            },
          ]}
          showCheck
        />

        {/* Language filter */}
        <Dropdown
          button={
            <>
              <FilterOutlined />
              <span className="hidden sm:inline">{`筛选：${filterLabel}`}</span>
            </>
          }
          buttonClassName={filterButtonClass}
          portalToBody
          items={[
            {
              label: "全部",
              active: filterLangs.includes("all"),
              onClick: () => onFilterToggle("all"),
            },
            ...LANG_OPTIONS.map((lang) => ({
              label: lang,
              active: !filterLangs.includes("all") && filterLangs.includes(lang),
              onClick: () => onFilterToggle(lang),
            })),
          ]}
          showCheck
        />

        {/* Create */}
        <button className={createButtonClass} onClick={onCreate}>
          <PlusOutlined />
          <span className="hidden sm:inline">新建项目</span>
        </button>
      </div>

      {/* Search — rightmost on mobile, leftmost on desktop; on mobile hides other buttons when open */}
      <div className="sm:order-1">
        <SearchBar
          value={searchText}
          onChange={onSearch}
          collapsible
          defaultExpanded={false}
          onExpandChange={setSearchExpanded}
        />
      </div>
    </PageHeader>
  );
};

export default Header;
