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
		"bg-white border border-[#bfdbfe] text-[#1d4ed8] w-9 h-9 rounded-xl font-semibold transition-[background,border-color,box-shadow] hover:bg-[#eff6ff] hover:border-[#93c5fd] hover:shadow-[0_8px_18px_rgba(59,130,246,0.18)]";
	const filterButtonClass =
		"bg-white border border-[#a7f3d0] text-[#047857] px-2.5 py-1.5 rounded-xl font-semibold transition-[background,border-color,box-shadow] hover:bg-[#ecfdf3] hover:border-[#6ee7b7] hover:shadow-[0_8px_18px_rgba(16,185,129,0.18)]";
	const createButtonClass =
		"bg-white border border-[#c7d2fe] text-[#3730a3] w-9 h-9 rounded-xl font-semibold transition-[background,border-color,box-shadow] hover:bg-[#eef2ff] hover:border-[#a5b4fc] hover:shadow-[0_8px_18px_rgba(99,102,241,0.18)]";
	const closeButtonClass =
		"bg-white border border-[#e2e8f0] text-[#475569] w-9 h-9 rounded-xl font-semibold transition-[background,border-color,box-shadow] hover:bg-[#f8fafc] hover:border-[#cbd5f5] hover:shadow-[0_8px_18px_rgba(15,23,42,0.12)]";

	return (
		<div className="flex justify-between items-center font-bold mb-3">
			<div className="text-[var(--brand-accent)] font-bold">
				已创建的大纲 ({count})
			</div>
			<div className="flex items-center gap-2">
				<SearchBar
					value={searchValue}
					onChange={onSearchChange}
					placeholder="搜索大纲"
					defaultExpanded
				/>
				<Dropdown
					button={order === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
					buttonClassName={sortButtonClass}
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
