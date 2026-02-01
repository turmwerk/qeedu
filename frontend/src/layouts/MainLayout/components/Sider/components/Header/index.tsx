import React from "react";
import {
	LeftOutlined,
	PlusOutlined,
	SearchOutlined,
	SortAscendingOutlined,
	SortDescendingOutlined,
} from "@ant-design/icons";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";

export type SiderHeaderProps = {
	order: "asc" | "desc";
	sortBy: "time" | "name";
	onToggleOrder: () => void;
	onSortByChange: (value: "time" | "name") => void;
	onSearch: () => void;
	onCreate: () => void;
	onClose: () => void;
};

const Header: React.FC<SiderHeaderProps> = ({
	order,
	sortBy,
	onToggleOrder,
	onSortByChange,
	onSearch,
	onCreate,
	onClose,
}) => {
	return (
		<div className="flex items-center justify-between px-4 py-3 border-b border-white/50">
			<div className="flex items-center gap-2 font-bold text-[#2d1b4f]">列表</div>
			<div className="flex items-center gap-2">
				<Button
					className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] shadow-[var(--brand-shadow)] transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:-translate-y-[1px]"
					onClick={onSearch}
					aria-label="搜索"
				>
					<SearchOutlined />
				</Button>
				<Button
					className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] shadow-[var(--brand-shadow)] transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:-translate-y-[1px]"
					onClick={onCreate}
					aria-label="新增"
				>
					<PlusOutlined />
				</Button>
				<Dropdown
					button={
						order === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />
					}
					buttonClassName="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] shadow-[var(--brand-shadow)] transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:-translate-y-[1px]"
					onButtonClick={onToggleOrder}
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
				<Button
					className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] shadow-[var(--brand-shadow)] transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:-translate-y-[1px]"
					onClick={onClose}
					aria-label="关闭侧边栏"
				>
					<LeftOutlined />
				</Button>
			</div>
		</div>
	);
};

export default Header;
