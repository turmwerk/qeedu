import React from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Button from "@/components/Button";

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
	return (
		<div className="flex-1 overflow-y-auto p-3 space-y-2">
			{items.length === 0 && (
				<div className="text-[#7d6b9a] text-sm px-2 py-4">暂无{emptyText}</div>
			)}
			{sortedItems.map((item, index) => (
				<div
					key={item.id}
					className={`group relative w-full rounded-xl border px-3 py-2 shadow-[0_8px_20px_rgba(124,58,237,0.12)] transition-all cursor-pointer hover:-translate-y-[2px] hover:shadow-[0_16px_32px_rgba(124,58,237,0.25)] hover:bg-purple-50/30 active:translate-y-0 active:scale-[0.98] ${
						selectedId === item.id
							? "border-purple-500 bg-gradient-to-br from-purple-200 via-indigo-100 to-purple-150 shadow-[0_10px_24px_rgba(124,58,237,0.3)]"
							: "border-purple-200/40 bg-white/80 hover:border-purple-400/70"
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
								selectedId === item.id ? "text-[#3d1a70]" : "text-[#3d256b]"
							}`}
						>
							{index + 1}. {item.title || "未命名课程"}
						</div>
					)}
					<div
						className={`text-xs mt-1 ${
							selectedId === item.id ? "text-[#5b4a7d]" : "text-[#8b7aa8]"
						}`}
					>
						{item.createdAt ? new Date(item.createdAt).toLocaleString() : "--"}
					</div>
					<div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
						<Button
							className="flex items-center justify-center w-7 h-7 rounded-lg bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] shadow-[var(--brand-shadow)] transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:scale-105"
							onClick={(e) => {
								e.stopPropagation();
								onStartEdit(item.id, item.title || "");
							}}
							aria-label="重命名"
						>
							<EditOutlined className="text-xs" />
						</Button>
						<Button
							className="flex items-center justify-center w-7 h-7 rounded-lg bg-white border border-red-300/70 text-[#d43b3b] shadow-[0_4px_12px_rgba(239,68,68,0.18)] transition-[background,border-color,box-shadow,transform] hover:bg-red-50 hover:border-red-400 hover:scale-105"
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
