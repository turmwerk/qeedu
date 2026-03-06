import React, { useEffect, useMemo, useState } from "react";
import { EditOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons";
import List from "@/ui/List";
import ConfirmDialog from "@/ui/ConfirmDialog";
import CreateModal from "../CreateModal";
import Header from "../ListPage/Header";

type ExamItem = {
	id: string;
	title: string;
	subtitle?: string;
	createdAt?: number;
};

interface Props {
	items: ExamItem[];
	onEdit: (id?: string) => void;
	onCreate: (payload: Record<string, unknown>) => void;
	onDelete: (id: string) => void;
	onRename: (id: string, newName: string) => void;
	openSignal?: number;
	modalMode?: boolean;
	onCloseModal?: () => void;
	currentId?: string | null;
}

const ListModal: React.FC<Props> = ({
	items,
	onEdit,
	onCreate,
	onDelete,
	onRename,
	openSignal,
	modalMode = false,
	onCloseModal,
	currentId,
}) => {
	const [open, setOpen] = useState(false);
	const [sortBy, setSortBy] = useState<"time" | "name">("time");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [filterKeys, setFilterKeys] = useState<Array<"all" | "final" | "mid">>([
		"all",
	]);
	const [searchText, setSearchText] = useState("");
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
	const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string>("");

	const sortedItems = useMemo(() => {
		const next = [...items];
		if (sortBy === "name") {
			next.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
		} else {
			next.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
		}
		if (order === "desc") next.reverse();
		return next;
	}, [items, order, sortBy]);

	const filteredItems = useMemo(() => {
		if (filterKeys.includes("all")) return sortedItems;
		return sortedItems.filter((item) => {
			const hitFinal = item.title.includes("期末");
			const hitMid = item.title.includes("期中");
			return (
				(filterKeys.includes("final") && hitFinal) ||
				(filterKeys.includes("mid") && hitMid)
			);
		});
	}, [filterKeys, sortedItems]);

	const searchValue = searchText.trim().toLowerCase();
	const searchedItems = useMemo(() => {
		if (!searchValue) return filteredItems;
		return filteredItems.filter((item) => {
			const content = `${item.title} ${item.subtitle || ""}`.toLowerCase();
			return content.includes(searchValue);
		});
	}, [filteredItems, searchValue]);

	const filterLabelMap: Record<"all" | "final" | "mid", string> = {
		all: "全部",
		final: "期末",
		mid: "期中",
	};
	const filterLabel = filterKeys.includes("all")
		? filterLabelMap.all
		: filterKeys.map((key) => filterLabelMap[key]).join("、") || "全部";

	const toggleFilter = (key: "all" | "final" | "mid") => {
		setFilterKeys((prev) => {
			if (key === "all") return ["all"];
			const next = prev.filter((k) => k !== "all");
			const exists = next.includes(key);
			const updated = exists ? next.filter((k) => k !== key) : [...next, key];
			return updated.length ? updated : ["all"];
		});
	};

	useEffect(() => {
		if (typeof openSignal === "number" && openSignal > 0) {
			const id = window.setTimeout(() => setOpen(true), 0);
			return () => window.clearTimeout(id);
		}
		return;
	}, [openSignal]);

	useEffect(() => {
		const onCreateOpen = () => setOpen(true);
		window.addEventListener("exam-exam-create", onCreateOpen);
		return () => window.removeEventListener("exam-exam-create", onCreateOpen);
	}, []);

	return (
		<div data-oid="u6aq20q">
			<div
				className={modalMode ? "p-2 text-[#444]" : "p-6 text-[#444]"}
				data-oid="una_80s"
			>
				<div className="grid grid-cols-1 gap-5 items-start" data-oid="1rygtha">
					<div data-oid="75rjirz">
						<div
							className={modalMode ? "rounded-xl p-[18px] min-h-[520px]" : "rounded-xl p-[18px] min-h-[520px] bg-white/[0.58] dark:bg-white/[0.18] border-0 dark:border dark:border-white/[0.28] shadow-[0_8px_30px_rgba(120,90,200,0.14),inset_0_1px_0_rgba(255,255,255,0.74),inset_0_-1px_0_rgba(255,255,255,0.34)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(255,255,255,0.12)] backdrop-blur-[40px] backdrop-saturate-[210%]"}
							data-oid=".m9p1gd"
						>
							<Header
								count={items.length}
								sortBy={sortBy}
								onSortChange={setSortBy}
								order={order}
								onToggleOrder={() =>
									setOrder((value) => (value === "asc" ? "desc" : "asc"))
								}
								filterLabel={filterLabel}
								filterKeys={filterKeys}
								onToggleFilter={toggleFilter}
								onCreate={() => setOpen(true)}
								searchValue={searchText}
								onSearchChange={setSearchText}
								modalMode={modalMode}
								onCloseModal={onCloseModal}
							/>
							<div className="p-1.5 sm:p-3" data-oid="qx3woto">
								<List<ExamItem>
									items={searchedItems}
									keyExtractor={(i) => i.id}
									hoverGlow={false}
									defaultActionClassName="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-5 py-1.5 sm:py-2 text-[13px] sm:text-[15px] font-semibold rounded-xl select-none bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#22c55e] cursor-pointer transition-[background,border-color,transform,color] hover:bg-[#f0fdf4] dark:hover:bg-white/18 hover:border-[#bbf7d0] hover:text-[#16a34a] hover:-translate-y-[1px]"
									editingActionClassName="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-5 py-1.5 sm:py-2 text-[13px] sm:text-[15px] font-semibold rounded-xl select-none bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#22c55e] cursor-pointer transition-[background,border-color,transform,color] hover:bg-[#f0fdf4] dark:hover:bg-white/18 hover:border-[#bbf7d0] hover:text-[#16a34a] hover:-translate-y-[1px]"
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
											<div
												className="teaching-list-title font-bold text-[var(--brand-blue)] dark:text-[#f8fbff]"
												data-oid="k.npzg7"
											>
												{item.title}
											</div>
											<div
												className="mt-1.5 flex gap-3 items-center"
												data-oid="-kd074w"
											>
												{item.subtitle && (
													<span className="teaching-list-subtitle text-[#888] dark:text-[#d1d9e6]" data-oid=".dokdd-">
														{item.subtitle}
													</span>
												)}
												{item.createdAt && (
													<span
														className="teaching-list-time text-[#999] text-[12px] dark:text-[#c0cadb]"
														data-oid="jzpmgij"
													>
														{new Date(item.createdAt).toLocaleString()}
													</span>
												)}
											</div>
										</>
									)}
									actions={[
										{
												label: <><FormOutlined /> <span className="hidden sm:inline">继续编辑</span></>,
											onClick: (item) => onEdit(item.id),
											className:
												"flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-5 py-1.5 sm:py-2 text-[13px] sm:text-[15px] font-semibold rounded-xl select-none bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#22c55e] cursor-pointer transition-[background,border-color,transform,color] hover:bg-[#f0fdf4] dark:hover:bg-white/18 hover:border-[#bbf7d0] hover:text-[#16a34a] hover:-translate-y-[1px]",
										},
										{
												label: <><EditOutlined /> <span className="hidden sm:inline">重命名</span></>,
											isRename: true,
											onClick: (item, newName?: string) =>
												newName && onRename(item.id, newName),
											className:
												"flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-5 py-1.5 sm:py-2 text-[13px] sm:text-[15px] font-semibold rounded-xl select-none bg-white dark:bg-white/10 text-[var(--brand-blue)] border border-transparent dark:border-white/[0.45] cursor-pointer transition-[background,border-color,color,transform] hover:bg-[#e8f3ff] dark:hover:bg-white/18 hover:border-[#93c5fd] hover:text-[var(--brand-blue)] hover:-translate-y-[1px]",
										},
										{
												label: <><DeleteOutlined /> <span className="hidden sm:inline">删除</span></>,
											onClick: (item) => {
												setConfirmDeleteId(item.id);
												setConfirmDeleteTitle(item.title || "未命名试卷");
											},
											className:
												"flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-5 py-1.5 sm:py-2 text-[13px] sm:text-[15px] font-semibold rounded-xl select-none bg-white dark:bg-white/10 border border-transparent dark:border-white/[0.45] text-[#dc2626] cursor-pointer transition-[background,border-color,color,transform] hover:bg-[#fef2f2] dark:hover:bg-white/18 hover:border-[#fecaca] hover:text-[#b91c1c] hover:-translate-y-[1px]",
										},
									]}
									emptyText="暂无试卷。"
									data-oid="qlnfqw:"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<CreateModal
				open={open}
				onClose={() => setOpen(false)}
				onCreate={onCreate}
			/>

			<ConfirmDialog
				open={!!confirmDeleteId}
				title="删除试卷"
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
				data-oid="5bvg0j1"
			/>
		</div>
	);
};

export default ListModal;
