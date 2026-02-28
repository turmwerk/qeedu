import React from "react";
import {
	LeftOutlined,
	PlusOutlined,
	SearchOutlined,
} from "@ant-design/icons";
import Button from "@/components/Button";

export type SiderHeaderProps = {
	onSearch: () => void;
	onCreate: () => void;
	onClose: () => void;
};

const Header: React.FC<SiderHeaderProps> = ({
	onSearch,
	onCreate,
	onClose,
}) => {
	const searchButtonClass =
		"flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[var(--brand-blue)] transition-[background,border-color,color,transform] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)] hover:scale-105 active:scale-95";
	const createButtonClass =
		"flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#22c55e] transition-[background,border-color,color,transform] hover:bg-[#f0fdf4] dark:hover:bg-white/18 hover:border-[#bbf7d0] hover:text-[#16a34a] hover:scale-105 active:scale-95";
	const closeButtonClass =
		"flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[var(--brand-blue)] transition-[background,border-color,color,transform] hover:text-[var(--brand-purple)] hover:bg-[var(--brand-accent-soft)] dark:hover:bg-white/18 hover:border-[var(--brand-purple)] hover:scale-105 active:scale-95";

	return (
		<div className="flex items-center justify-between px-4 py-3 border-b border-white/50">
			<div className="flex items-center gap-2 font-bold text-[#2d1b4f] dark:text-white">列表</div>
			<div className="flex items-center gap-2">
				<Button
					className={searchButtonClass}
					onClick={onSearch}
					aria-label="搜索"
				>
					<SearchOutlined />
				</Button>
				<Button
					className={createButtonClass}
					onClick={onCreate}
					aria-label="新增"
				>
					<PlusOutlined />
				</Button>
				<Button
					className={closeButtonClass}
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
