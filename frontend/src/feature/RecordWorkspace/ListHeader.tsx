import React, { useMemo, useState } from "react";
import {
  CloseOutlined,
  FilterOutlined,
  PlusOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import Button from "@/ui/Button";
import Dropdown from "@/ui/Dropdown";
import PageHeader from "@/ui/PageHeader";
import SearchBar from "@/ui/SearchBar";
import type { WorkspaceFilter } from "./types";

type Props = {
  title: string;
  count: number;
  sortBy: "time" | "name";
  onSortChange: (value: "time" | "name") => void;
  order: "asc" | "desc";
  onToggleOrder: () => void;
  filters: WorkspaceFilter[];
  filterKeys: string[];
  onToggleFilter: (key: string) => void;
  onCreate: () => void;
  createButtonLabel: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  modalMode?: boolean;
  onCloseModal?: () => void;
};

const sortButtonClass =
  "bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[var(--brand-blue)] h-8 min-w-8 px-2 sm:h-9 sm:min-w-9 sm:px-3 rounded-xl text-[15px] font-semibold transition-[background,border-color,color,transform] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)] active:scale-95 flex items-center justify-center gap-1.5 select-none";
const filterButtonClass =
  "bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[var(--brand-blue)] px-2 h-8 sm:px-3 sm:h-9 text-[15px] rounded-xl font-semibold transition-[background,border-color,color,transform] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)] active:scale-95 select-none flex items-center gap-1.5";
const createButtonClass =
  "bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#22c55e] h-8 min-w-8 px-2 sm:h-9 sm:min-w-9 sm:px-3 rounded-xl text-[15px] font-semibold transition-[background,border-color,color,transform] hover:bg-[#f0fdf4] dark:hover:bg-white/18 hover:border-[#bbf7d0] hover:text-[#16a34a] active:scale-95 flex items-center justify-center gap-1.5 select-none";
const closeButtonClass =
  "bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#dc2626] h-8 min-w-8 px-2 sm:h-9 sm:min-w-9 sm:px-3 rounded-xl text-[15px] font-semibold transition-[background,border-color,color,transform] hover:bg-[#ffecec] dark:hover:bg-white/18 hover:border-[#f1a1a1] hover:text-[#b91c1c] active:scale-95 flex items-center justify-center gap-1.5 select-none";

const ListHeader: React.FC<Props> = ({
  title,
  count,
  sortBy,
  onSortChange,
  order,
  onToggleOrder,
  filters,
  filterKeys,
  onToggleFilter,
  onCreate,
  createButtonLabel,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  modalMode = false,
  onCloseModal,
}) => {
  const [searchExpanded, setSearchExpanded] = useState(false);

  const filterLabel = useMemo(() => {
    if (filterKeys.includes("all")) return "全部";
    return (
      filterKeys
        .map((key) => filters.find((item) => item.key === key)?.label)
        .filter(Boolean)
        .join("、") || "全部"
    );
  }, [filterKeys, filters]);

  return (
    <PageHeader
      title={
        <span className="text-[14px] sm:text-base font-bold text-[var(--brand-blue)] dark:text-white">
          {title}({count})
        </span>
      }
    >
      <div
        className={`${searchExpanded ? "hidden sm:flex" : "flex"} items-center gap-1.5 sm:gap-2 sm:order-2`}
      >
        <Dropdown
          button={order === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
          buttonClassName={sortButtonClass}
          portalToBody
          onButtonClick={onToggleOrder}
          items={[
            { label: "按时间", active: sortBy === "time", onClick: () => onSortChange("time") },
            { label: "按名称", active: sortBy === "name", onClick: () => onSortChange("name") },
          ]}
          showCheck
        />
        <Dropdown
          button={
            <>
              <FilterOutlined />
              <span className="hidden sm:inline">{`筛选：${filterLabel}`}</span>
            </>
          }
          buttonClassName={filterButtonClass}
          portalToBody
          items={filters.map((filter) => ({
            label: filter.label,
            active: filterKeys.includes("all")
              ? filter.key === "all"
              : filterKeys.includes(filter.key),
            onClick: () => onToggleFilter(filter.key),
          }))}
          showCheck
        />
        <Button className={createButtonClass} onClick={onCreate} aria-label={createButtonLabel}>
          <PlusOutlined />
          <span className="hidden sm:inline">{createButtonLabel}</span>
        </Button>
        {modalMode && (
          <Button className={closeButtonClass} onClick={onCloseModal} aria-label="关闭">
            <CloseOutlined />
          </Button>
        )}
      </div>

      <div className="sm:order-1">
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          collapsible
          defaultExpanded={false}
          onExpandChange={setSearchExpanded}
        />
      </div>
    </PageHeader>
  );
};

export default ListHeader;

