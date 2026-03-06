import React from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Button from "@/ui/Button";

export type SiderListItem = {
	id: string;
	title: string;
	createdAt?: number;
};

export type SiderListProps = {
	items: SiderListItem[];
	sortedItems: SiderListItem[];
	selectedId: string | null;
	editingId: string | null;
	editingTitle: string;
	emptyText: string;
	onSelect: (id: string) => void;
	onStartEdit: (id: string, title: string) => void;
	onChangeEdit: (value: string) => void;
	onCommitEdit: (id: string, value: string) => void;
	onCancelEdit: () => void;
	onDelete: (id: string, title: string) => void;
};

const List: React.FC<SiderListProps> = ({
	items,
	sortedItems,
	selectedId,
	editingId,
	editingTitle,
	emptyText,
	onSelect,
	onStartEdit,
	onChangeEdit,
	onCommitEdit,
	onCancelEdit,
	onDelete,
}) => {
	const editButtonClass =
		"flex items-center justify-center w-7 h-7 rounded-lg bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[var(--brand-blue)] transition-[background,border-color,color,transform] hover:bg-[#e8f3ff] dark:hover:bg-white/18 hover:border-[#93c5fd] hover:text-[var(--brand-blue)] hover:scale-105";

	return (
		<div className="flex-1 overflow-y-auto p-3 space-y-2">
			{items.length === 0 && (
				<div className="text-[#7d6b9a] text-sm px-2 py-4">暂无{emptyText}</div>
			)}
			{sortedItems.map((item, index) => (
				<div
					key={item.id}
				className={`group relative w-full rounded-xl border px-3 py-2 backdrop-blur-[12px] transition-all cursor-pointer active:translate-y-0 active:scale-[0.98] ${
					selectedId === item.id
						? "border-white/80 dark:border-white/50 bg-white/65 dark:bg-white/[0.28] shadow-[0_6px_14px_rgba(15,23,42,0.12)]"
						: "border-white/55 dark:border-white/[0.38] bg-white/50 dark:bg-white/[0.20] shadow-[0_4px_12px_rgba(15,23,42,0.08)] hover:bg-white/60 dark:hover:bg-white/[0.32] hover:border-white/75 dark:hover:border-white/[0.55]"
					}`}
					onClick={() => {
						if (selectedId === item.id) return;
						onSelect(item.id);
					}}
				>
					{editingId === item.id ? (
						<input
							type="text"
							value={editingTitle}
							onChange={(e) => onChangeEdit(e.target.value)}
							onClick={(e) => e.stopPropagation()}
							placeholder="输入名称"
							title="重命名"
							onBlur={() => {
								if (editingTitle.trim()) {
									onCommitEdit(item.id, editingTitle.trim());
								}
								onCancelEdit();
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.currentTarget.blur();
								} else if (e.key === "Escape") {
									onCancelEdit();
								}
							}}
							autoFocus
							className="w-full font-semibold text-sm bg-white border border-purple-300 rounded-lg px-2 py-1 focus:outline-none focus:border-purple-500 text-[#3d256b]"
						/>
					) : (
						<div
							className={`font-semibold text-sm ${
								selectedId === item.id ? "text-[#3d1a70] dark:text-white" : "text-[#3d256b] dark:text-white"
							}`}
						>
							{index + 1}. {item.title || "未命名课程"}
						</div>
					)}
					<div
						className={`text-xs mt-1 dark:text-white ${
							selectedId === item.id ? "text-[#5b4a7d]" : "text-[#8b7aa8]"
						}`}
					>
						{item.createdAt ? new Date(item.createdAt).toLocaleString() : "--"}
					</div>
					<div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
						<Button
							className={editButtonClass}
							onClick={(e) => {
								e.stopPropagation();
								onStartEdit(item.id, item.title || "");
							}}
							aria-label="重命名"
						>
							<EditOutlined className="text-xs" />
						</Button>
						<Button
							className="flex items-center justify-center w-7 h-7 rounded-lg bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#d43b3b] shadow-[0_4px_12px_rgba(239,68,68,0.18)] transition-[background,border-color,box-shadow,transform] hover:bg-red-50 dark:hover:bg-white/18 hover:border-red-400 hover:scale-105"
							onClick={(e) => {
								e.stopPropagation();
								onDelete(item.id, item.title || "未命名课程");
							}}
							aria-label="删除"
						>
							<DeleteOutlined className="text-xs" />
						</Button>
					</div>
				</div>
			))}
		</div>
	);
};

export default List;
