import React from "react";
import {
	CloseOutlined,
	PlusOutlined,
	SortAscendingOutlined,
	SortDescendingOutlined,
} from "@ant-design/icons";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import SearchBar from "@/pages/Teaching/Syllabus/components/SearchBar";

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
		"bg-white border border-transparent text-[var(--brand-blue)] h-9 min-w-9 px-3 rounded-xl text-[15px] font-semibold transition-[background,border-color,color,transform] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-purple)] active:scale-95 flex items-center justify-center gap-1.5 select-none";
	const filterButtonClass =
		"bg-white border border-transparent text-[var(--brand-blue)] px-5 py-2 text-[15px] rounded-xl font-semibold transition-[background,border-color,color,transform] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-purple)] active:scale-95 select-none";
	const createButtonClass =
		"bg-white border border-transparent text-[#22c55e] h-9 min-w-9 px-3 rounded-xl text-[15px] font-semibold transition-[background,border-color,color,transform] hover:bg-[#f0fdf4] hover:border-[#bbf7d0] hover:text-[#16a34a] active:scale-95 flex items-center justify-center gap-1.5 select-none";
	const closeButtonClass =
		"bg-white border border-transparent text-[#dc2626] h-9 min-w-9 px-3 rounded-xl text-[15px] font-semibold transition-[background,border-color,color,transform] hover:bg-[#ffecec] hover:border-[#f1a1a1] hover:text-[#b91c1c] active:scale-95 flex items-center justify-center gap-1.5 select-none";

	return (
		<div className="flex justify-between items-center font-bold mb-3">
			<div className="text-[var(--brand-blue)] font-bold">
				已创建的大纲 ({count})
			</div>
			<div className="flex items-center gap-2">
				<div className="w-[280px]">
					<SearchBar
						value={searchValue}
						onChange={onSearchChange}
						placeholder="搜索大纲"
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
						{ key: "intro", label: "含“导论”" },
						{ key: "overview", label: "含“概论”" },
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
				<Button className={createButtonClass} onClick={onCreate} aria-label="新建大纲">
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
