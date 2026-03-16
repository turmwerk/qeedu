import React, { useState } from "react";
import {
	CloseOutlined,
	FilterOutlined,
	PlusOutlined,
	SortAscendingOutlined,
	SortDescendingOutlined,
} from "@ant-design/icons";
import Button from "@/ui/Button";
import PageHeader from "@/ui/PageHeader";
import Dropdown from "@/ui/Dropdown";
import SearchBar from "@/ui/SearchBar";

interface Props {
	count: number;
	sortBy: "time" | "name";
	onSortChange: (value: "time" | "name") => void;
	order: "asc" | "desc";
	onToggleOrder: () => void;
	filterLabel: string;
	filterKeys: Array<"all" | "intro" | "overview">;
	onToggleFilter: (key: "all" | "intro" | "overview") => void;
	onCreate: () => void;
	searchValue: string;
	onSearchChange: (value: string) => void;
	modalMode?: boolean;
	onCloseModal?: () => void;
}

const sortButtonClass =
	"bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[var(--brand-blue)] h-8 min-w-8 px-2 sm:h-9 sm:min-w-9 sm:px-3 rounded-xl text-[15px] font-semibold transition-[background,border-color,color,transform] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)] active:scale-95 flex items-center justify-center gap-1.5 select-none";
const filterButtonClass =
	"bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[var(--brand-blue)] px-2 h-8 sm:px-3 sm:h-9 text-[15px] rounded-xl font-semibold transition-[background,border-color,color,transform] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)] active:scale-95 select-none flex items-center gap-1.5";
const createButtonClass =
	"bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#22c55e] h-8 min-w-8 px-2 sm:h-9 sm:min-w-9 sm:px-3 rounded-xl text-[15px] font-semibold transition-[background,border-color,color,transform] hover:bg-[#f0fdf4] dark:hover:bg-white/18 hover:border-[#bbf7d0] hover:text-[#16a34a] active:scale-95 flex items-center justify-center gap-1.5 select-none";
const closeButtonClass =
	"bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#dc2626] h-8 min-w-8 px-2 sm:h-9 sm:min-w-9 sm:px-3 rounded-xl text-[15px] font-semibold transition-[background,border-color,color,transform] hover:bg-[#ffecec] dark:hover:bg-white/18 hover:border-[#f1a1a1] hover:text-[#b91c1c] active:scale-95 flex items-center justify-center gap-1.5 select-none";

const Header: React.FC<Props> = ({
	count,
	sortBy,
	onSortChange,
	order,
	onToggleOrder,
	filterLabel,
	filterKeys,
	onToggleFilter,
	onCreate,
	searchValue,
	onSearchChange,
	modalMode = false,
	onCloseModal,
}) => {
	const [searchExpanded, setSearchExpanded] = useState(false);

	return (
		<PageHeader
			title={
				<span className="text-[14px] sm:text-base font-bold text-[var(--brand-blue)] dark:text-white">
					大纲({count})
				</span>
			}
		>
			{/* Sort + Filter + Create + Close
			    DOM order: first → leftmost on mobile
			    sm:order-2 → after search on desktop */}
			<div className={`${searchExpanded ? "hidden sm:flex" : "flex"} items-center gap-1.5 sm:gap-2 sm:order-2`}>
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
					items={([
						{ key: "all", label: "全部" },
						{ key: "intro", label: "含“导论”" },
						{ key: "overview", label: "含“概论”" },
					] as const).map((item) => ({
						label: item.label,
						active: filterKeys.includes("all") ? item.key === "all" : filterKeys.includes(item.key),
						onClick: () => onToggleFilter(item.key),
					}))}
					showCheck
				/>
				<Button className={createButtonClass} onClick={onCreate} aria-label="新建大纲">
					<PlusOutlined />
					<span className="hidden sm:inline">新建大纲</span>
				</Button>
				{modalMode && (
					<Button className={closeButtonClass} onClick={onCloseModal} aria-label="关闭">
						<CloseOutlined />
					</Button>
				)}
			</div>

			{/* Search
			    DOM order: last → rightmost on mobile
			    sm:order-1 → left of sort group on desktop; desktop expand does NOT hide others */}
			<div className="sm:order-1">
				<SearchBar
					value={searchValue}
					onChange={onSearchChange}
					placeholder="搜索大纲"
					collapsible
					defaultExpanded={false}
					onExpandChange={setSearchExpanded}
				/>
			</div>
		</PageHeader>
	);
};

export default Header;
