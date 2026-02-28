import React from "react";
import {
	CloseOutlined,
	PlusOutlined,
	SortAscendingOutlined,
	SortDescendingOutlined,
} from "@ant-design/icons";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import SearchBar from "@/pages/Teaching/ExamDesign/components/SearchBar";

interface Props {
	count: number;
	sortBy: "time" | "name";
	onSortChange: (value: "time" | "name") => void;
	order: "asc" | "desc";
	onToggleOrder: () => void;
	filterLabel: string;
	filterKeys: Array<"all" | "final" | "mid">;
	onToggleFilter: (key: "all" | "final" | "mid") => void;
	onCreate: () => void;
	searchValue: string;
	onSearchChange: (value: string) => void;
	modalMode?: boolean;
	onCloseModal?: () => void;
}

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
	const sortButtonClass =
		"bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[var(--brand-blue)] h-9 min-w-9 px-3 rounded-xl text-[15px] font-semibold transition-[background,border-color,color,transform] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)] active:scale-95 flex items-center justify-center gap-1.5 select-none";
	const filterButtonClass =
		"bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[var(--brand-blue)] px-5 py-2 text-[15px] rounded-xl font-semibold transition-[background,border-color,color,transform] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)] active:scale-95 select-none";
	const createButtonClass =
		"bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#22c55e] h-9 min-w-9 px-3 rounded-xl text-[15px] font-semibold transition-[background,border-color,color,transform] hover:bg-[#f0fdf4] dark:hover:bg-white/18 hover:border-[#bbf7d0] hover:text-[#16a34a] active:scale-95 flex items-center justify-center gap-1.5 select-none";
	const closeButtonClass =
		"bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#dc2626] h-9 min-w-9 px-3 rounded-xl text-[15px] font-semibold transition-[background,border-color,color,transform] hover:bg-[#ffecec] dark:hover:bg-white/18 hover:border-[#f1a1a1] hover:text-[#b91c1c] active:scale-95 flex items-center justify-center gap-1.5 select-none";

	return (
		<div className="flex justify-between items-center font-bold mb-3">
			<div className="text-[var(--brand-accent)] dark:text-white font-bold">
				已创建的试卷 ({count})
			</div>
			<div className="flex items-center gap-2">
				<div className="w-[280px]">
					<SearchBar
						value={searchValue}
						onChange={onSearchChange}
						placeholder="搜索试卷"
						defaultExpanded
					/>
				</div>
				<Dropdown
					button={order === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
					buttonClassName={sortButtonClass}
					portalToBody
					onButtonClick={onToggleOrder}
					items={[
						{
							label: "按时间",
							active: sortBy === "time",
							onClick: () => onSortChange("time"),
						},
						{
							label: "按名称",
							active: sortBy === "name",
							onClick: () => onSortChange("name"),
						},
					]}
					showCheck
				/>
				<Dropdown
					button={`筛选：${filterLabel}`}
					buttonClassName={filterButtonClass}
					portalToBody
					items={([
						{ key: "all", label: "全部" },
						{ key: "final", label: "期末" },
						{ key: "mid", label: "期中" },
					] as const).map((item) => {
						const checked = filterKeys.includes("all")
							? item.key === "all"
							: filterKeys.includes(item.key);
						return {
							label: item.label,
							active: checked,
							onClick: () => onToggleFilter(item.key),
						};
					})}
					showCheck
				/>
				<Button className={createButtonClass} onClick={onCreate} aria-label="新建试卷">
					<PlusOutlined />
				</Button>
				{modalMode && (
					<Button
						className={closeButtonClass}
						onClick={onCloseModal}
						aria-label="关闭"
					>
						<CloseOutlined />
					</Button>
				)}
			</div>
		</div>
	);
};

export default Header;
