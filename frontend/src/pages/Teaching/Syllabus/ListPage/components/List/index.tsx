import React, { useState } from "react";
import { EditOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons";
import BaseList from "@/components/List";
import ConfirmDialog from "@/components/ConfirmDialog";

export type Outline = {
	id: string;
	title: string;
	subtitle?: string;
	md?: string;
	createdAt?: number;
};

type Props = {
	items: Outline[];
	onEdit: (id: string) => void;
	onRename: (id: string, newName: string) => void;
	onDelete: (id: string) => void;
	currentId?: string | null;
};

const actionCls =
	"flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-5 py-1.5 sm:py-2 text-[13px] sm:text-[15px] font-semibold rounded-xl select-none bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#22c55e] cursor-pointer transition-[background,border-color,transform,color] hover:bg-[#f0fdf4] dark:hover:bg-white/18 hover:border-[#bbf7d0] hover:text-[#16a34a] hover:-translate-y-[1px]";
const renameCls =
	"flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-5 py-1.5 sm:py-2 text-[13px] sm:text-[15px] font-semibold rounded-xl select-none bg-white dark:bg-white/10 text-[var(--brand-blue)] border border-transparent dark:border-white/[0.45] cursor-pointer transition-[background,border-color,color,transform] hover:bg-[#e8f3ff] dark:hover:bg-white/18 hover:border-[#93c5fd] hover:text-[var(--brand-blue)] hover:-translate-y-[1px]";
const deleteCls =
	"flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-5 py-1.5 sm:py-2 text-[13px] sm:text-[15px] font-semibold rounded-xl select-none bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#dc2626] cursor-pointer transition-[background,border-color,color,transform] hover:bg-[#fef2f2] dark:hover:bg-white/18 hover:border-[#fecaca] hover:text-[#b91c1c] hover:-translate-y-[1px]";

const SyllabusList: React.FC<Props> = ({
	items,
	onEdit,
	onRename,
	onDelete,
	currentId,
}) => {
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
	const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string>("");

	return (
		<>
			<div className="p-1.5 sm:p-3">
				<BaseList<Outline>
					items={items}
					keyExtractor={(i) => i.id}
					hoverGlow={false}
					defaultActionClassName={actionCls}
					editingActionClassName={actionCls}
					editable={{ getValue: (i) => i.title }}
					onItemClick={(item) => onEdit(item.id)}
					isItemDisabled={(item) => !!currentId && item.id === currentId}
					itemClassName={(item) =>
						currentId && item.id === currentId
							? "border-[#c7d2fe] bg-[#eef2ff]"
							: ""
					}
					renderItem={(item) => (
						<>
							<div className="teaching-list-title font-bold text-[var(--brand-blue)] dark:text-[#f8fbff]">
								{item.title}
							</div>
							<div className="mt-1.5 flex gap-3 items-center flex-wrap">
								{item.subtitle && (
									<span className="teaching-list-subtitle text-[#888] dark:text-[#d1d9e6]">
										{item.subtitle}
									</span>
								)}
								{item.createdAt && (
									<span className="teaching-list-time text-[#999] text-[12px] dark:text-[#c0cadb]">
										{new Date(item.createdAt).toLocaleString()}
									</span>
								)}
							</div>
						</>
					)}
					actions={[
						{
							label: (
								<>
									<FormOutlined />{" "}
									<span className="hidden sm:inline">继续编辑</span>
								</>
							),
							onClick: (item) => onEdit(item.id),
							className: actionCls,
						},
						{
							label: (
								<>
									<EditOutlined />{" "}
									<span className="hidden sm:inline">重命名</span>
								</>
							),
							isRename: true,
							onClick: (item, newName?: string) =>
								newName && onRename(item.id, newName),
							className: renameCls,
						},
						{
							label: (
								<>
									<DeleteOutlined />{" "}
									<span className="hidden sm:inline">删除</span>
								</>
							),
							onClick: (item) => {
								setConfirmDeleteId(item.id);
								setConfirmDeleteTitle(item.title || "未命名大纲");
							},
							className: deleteCls,
						},
					]}
					emptyText="暂无课程大纲。"
				/>
			</div>

			<ConfirmDialog
				open={!!confirmDeleteId}
				title="删除课程大纲"
				description={`确认删除「${confirmDeleteTitle}」吗？此操作不可恢复。`}
				confirmText="确认删除"
				danger
				onCancel={() => {
					setConfirmDeleteId(null);
					setConfirmDeleteTitle("");
				}}
				onConfirm={() => {
					if (confirmDeleteId) onDelete(confirmDeleteId);
					setConfirmDeleteId(null);
					setConfirmDeleteTitle("");
				}}
			/>
		</>
	);
};

export default SyllabusList;
