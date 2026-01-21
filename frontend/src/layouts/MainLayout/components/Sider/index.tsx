import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
	DeleteOutlined,
	EditOutlined,
	LeftOutlined,
	PlusOutlined,
	SearchOutlined,
	SortAscendingOutlined,
	SortDescendingOutlined,
} from "@ant-design/icons";
import ConfirmDialog from "@/components/ConfirmDialog";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Model from "@/components/Model";

type SiderItem = {
	id: string;
	title: string;
	createdAt?: number;
};

type Props = {
	open: boolean;
	onClose: () => void;
	storageKey: string;
	title: string;
	createEventName: string;
	updatedEventName: string;
	currentIdEventName: string;
	selectEventName: string;
	deleteEventName: string;
	widthEventName: string;
	getWidthEventName: string;
	listModalComponent?: React.ComponentType<ListModalProps>;
};

type ListModalItem = {
	id: string;
	title: string;
	subtitle?: string;
	md?: string;
	createdAt?: number;
};

type ListModalProps = {
	items: ListModalItem[];
	onEdit: (id?: string) => void;
	onCreate: (payload: Record<string, unknown>) => void;
	onDelete: (id: string) => void;
	onRename: (id: string, newName: string) => void;
	openSignal?: number;
	modalMode?: boolean;
	onCloseModal?: () => void;
	currentId?: string | null;
};

const Sider: React.FC<Props> = ({
	open,
	onClose,
	storageKey,
	title,
	createEventName,
	updatedEventName,
	currentIdEventName,
	selectEventName,
	deleteEventName,
	widthEventName,
	getWidthEventName,
	listModalComponent: ListModalComponent,
}) => {
	const [items, setItems] = useState<SiderItem[]>([]);
	const widthId = useId().replace(/[:]/g, "");
	const widthClass = `sider-width-${widthId}`;
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [sortBy, setSortBy] = useState<"time" | "name">("time");
	const [order, setOrder] = useState<"asc" | "desc">("asc");
	const [width, setWidth] = useState(300);
	const isDragging = useRef(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingTitle, setEditingTitle] = useState("");
	const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string | null; title: string }>({ open: false, id: null, title: "" });
	const [listModalOpen, setListModalOpen] = useState(false);

	const loadItems = useCallback(() => {
		try {
			const raw = localStorage.getItem(storageKey);
			if (raw) {
				const parsed = JSON.parse(raw) as Array<SiderItem & Record<string, unknown>>;
				setItems(
					parsed.map((item) => ({
						id: item.id,
						title: item.title,
						createdAt: item.createdAt,
					})),
				);
			} else {
				setItems([]);
			}
		} catch {
			setItems([]);
		}
	}, [storageKey]);

	useEffect(() => {
		const id = window.setTimeout(() => loadItems(), 0);
		const onStorage = () => loadItems();
		const onCustom = () => loadItems();
		const onSelect = (event: Event) => {
			const detail = (event as CustomEvent<{ id?: string }>).detail;
			if (detail?.id) setSelectedId(detail.id);
		};
		window.addEventListener("storage", onStorage);
		window.addEventListener(updatedEventName, onCustom as EventListener);
		window.addEventListener(currentIdEventName, onSelect as EventListener);
		return () => {
			window.clearTimeout(id);
			window.removeEventListener("storage", onStorage);
			window.removeEventListener(updatedEventName, onCustom as EventListener);
			window.removeEventListener(
				currentIdEventName,
				onSelect as EventListener
			);
		};
	}, [loadItems, updatedEventName, currentIdEventName]);

	const persistRename = useCallback(
		(id: string, nextTitle: string) => {
			try {
				const raw = localStorage.getItem(storageKey);
				const parsed = raw
					? (JSON.parse(raw) as Array<Record<string, unknown> & SiderItem>)
					: [];
				const updated = parsed.map((item) =>
					item.id === id ? { ...item, title: nextTitle } : item,
				);
				localStorage.setItem(storageKey, JSON.stringify(updated));
				setItems(
					updated.map((item) => ({
						id: item.id,
						title: item.title,
						createdAt: item.createdAt,
					})),
				);
				window.dispatchEvent(new Event(updatedEventName));
			} catch (e) {
				console.warn("rename item failed", e);
			}
		},
		[storageKey, updatedEventName]
	);

	const startDrag = useCallback(() => {
		isDragging.current = true;
	}, []);

	const stopDrag = useCallback(() => {
		isDragging.current = false;
	}, []);

	const onDrag = useCallback((clientX: number) => {
		if (!isDragging.current) return;
		const clamped = Math.min(420, Math.max(220, clientX));
		setWidth(clamped);
		// 通知 MarkdownEditor 宽度变化
		window.dispatchEvent(
			new CustomEvent(widthEventName, {
				detail: { width: clamped },
			})
		);
	}, [widthEventName]);


	useEffect(() => {
		const onWindowMove = (event: MouseEvent) => {
			if (!isDragging.current) return;
			onDrag(event.clientX);
		};
		const onWindowUp = () => stopDrag();
		const onWindowTouchMove = (event: TouchEvent) => {
			if (!isDragging.current) return;
			const touch = event.touches[0];
			if (touch) onDrag(touch.clientX);
		};
		const onWindowTouchEnd = () => stopDrag();
		window.addEventListener("mousemove", onWindowMove);
		window.addEventListener("mouseup", onWindowUp);
		window.addEventListener("touchmove", onWindowTouchMove, { passive: true });
		window.addEventListener("touchend", onWindowTouchEnd);
		return () => {
			window.removeEventListener("mousemove", onWindowMove);
			window.removeEventListener("mouseup", onWindowUp);
			window.removeEventListener("touchmove", onWindowTouchMove);
			window.removeEventListener("touchend", onWindowTouchEnd);
		};
	}, [onDrag, stopDrag]);

	const actualWidth = open ? width : 0;
	const widthStyle = useMemo(
		() => `.${widthClass} { width: ${actualWidth}px; min-width: ${actualWidth}px; }`,
		[actualWidth, widthClass]
	);

	useEffect(() => {
		window.dispatchEvent(
			new CustomEvent(widthEventName, {
				detail: { width: actualWidth },
			})
		);
	}, [actualWidth, widthEventName]);

	useEffect(() => {
		const handleGetWidth = () => {
			window.dispatchEvent(
				new CustomEvent(widthEventName, {
					detail: { width: actualWidth },
				})
			);
		};
		window.addEventListener(getWidthEventName, handleGetWidth);
		return () => {
			window.removeEventListener(getWidthEventName, handleGetWidth);
		};
	}, [actualWidth, getWidthEventName, widthEventName]);

	const sortedItems = useMemo(() => {
		const next = [...items];
		if (sortBy === "name") {
			next.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
		} else {
			next.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
		}
		if (order === "desc") next.reverse();
		return next;
	}, [items, sortBy, order]);

	const listModalItems = useMemo<ListModalItem[]>(
		() =>
			items.map((item) => ({
				id: item.id,
				title: item.title,
				createdAt: item.createdAt,
			})),
		[items]
	);

	const handleModalCreate = useCallback(
		(payload: Record<string, unknown>) => {
			const id = Date.now().toString();
			const name =
				typeof payload.name === "string" && payload.name.trim()
					? payload.name.trim()
					: "未命名";
			const createdAt = Date.now();
			if (storageKey === "syllabus_outlines") {
				const intro = typeof payload.intro === "string" ? payload.intro : "";
				const goals = typeof payload.goals === "string" ? payload.goals : "";
				const md = `# ${name}\n\n## 课程简介\n${intro || "..."}\n\n## 教学目标\n${goals || "..."}`;
				const item = { id, title: name, md, createdAt };
				try {
					const raw = localStorage.getItem(storageKey);
					const parsed = raw ? (JSON.parse(raw) as any[]) : [];
					const next = [item, ...parsed];
					localStorage.setItem(storageKey, JSON.stringify(next));
					window.dispatchEvent(new Event(updatedEventName));
					window.dispatchEvent(
						new CustomEvent(currentIdEventName, { detail: { id } })
					);
				} catch (e) {
					console.warn("create outline failed", e);
				}
			} else if (storageKey === "exam_design_exams_v1") {
				const item = { id, title: name, questions: [], createdAt };
				try {
					const raw = localStorage.getItem(storageKey);
					const parsed = raw ? (JSON.parse(raw) as any[]) : [];
					const next = [item, ...parsed];
					localStorage.setItem(storageKey, JSON.stringify(next));
					window.dispatchEvent(new Event(updatedEventName));
					window.dispatchEvent(
						new CustomEvent(currentIdEventName, { detail: { id } })
					);
				} catch (e) {
					console.warn("create exam failed", e);
				}
			}
		},
		[storageKey, updatedEventName, currentIdEventName]
	);

	return (
		<div
			className={`relative h-screen z-[10000] transition-all duration-200 ease-out overflow-hidden ${widthClass}`}
			data-oid="syllabus-sider"
		>
			<style data-oid="sider-width">{widthStyle}</style>
			<div className="h-full bg-white/70 backdrop-blur-[18px] shadow-[0_12px_40px_rgba(124,58,237,0.2)] border-r border-white/60 flex flex-col">
				<div className="flex items-center justify-between px-4 py-3 border-b border-white/50">
					<div className="flex items-center gap-2 font-bold text-[#2d1b4f]">
						列表
					</div>
					<div className="flex items-center gap-2">
						<Button
								className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] shadow-[var(--brand-shadow)] transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:-translate-y-[1px]"
								onClick={() => setListModalOpen(true)}
								aria-label="搜索"
							>
								<SearchOutlined />
							</Button>
							<Button
							className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] shadow-[var(--brand-shadow)] transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:-translate-y-[1px]"
							onClick={() =>
								window.dispatchEvent(new Event(createEventName))
							}
							aria-label="新增"
						>
							<PlusOutlined />
						</Button>
						<Dropdown
								button={order === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
							buttonClassName="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] shadow-[var(--brand-shadow)] transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:-translate-y-[1px]"
								onButtonClick={() => setOrder((v) => (v === "asc" ? "desc" : "asc"))}
							items={[
								{
									label: "按时间",
									active: sortBy === "time",
									onClick: () => setSortBy("time"),
								},
								{
									label: "按名称",
									active: sortBy === "name",
									onClick: () => setSortBy("name"),
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
				<div className="flex-1 overflow-y-auto p-3 space-y-2">
					{items.length === 0 && (
						<div className="text-[#7d6b9a] text-sm px-2 py-4">
							暂无{title}
						</div>
					)}
					{sortedItems.map((item, index) => (
						<div
							key={item.id}
							className={`group relative w-full rounded-xl border px-3 py-2 shadow-[0_8px_20px_rgba(124,58,237,0.12)] transition-all cursor-pointer hover:-translate-y-[2px] hover:shadow-[0_16px_32px_rgba(124,58,237,0.25)] hover:bg-purple-50/30 active:translate-y-0 active:scale-[0.98] ${
								selectedId === item.id
									? "border-purple-500 bg-gradient-to-br from-purple-200 via-indigo-100 to-purple-150 shadow-[0_10px_24px_rgba(124,58,237,0.3)]"
									: "border-purple-200/40 bg-white/80 hover:border-purple-400/70"
							}`}
							onClick={() =>
								window.dispatchEvent(
									new CustomEvent(selectEventName, {
										detail: { id: item.id },
									})
								)
							}
						>
							{editingId === item.id ? (
								<input
									type="text"
									value={editingTitle}
									onChange={(e) => setEditingTitle(e.target.value)}
									onClick={(e) => e.stopPropagation()}
									placeholder="输入名称"
									title="重命名"
									onBlur={() => {
										if (editingTitle.trim()) {
											persistRename(item.id, editingTitle.trim());
										}
										setEditingId(null);
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.currentTarget.blur();
										} else if (e.key === "Escape") {
											setEditingId(null);
										}
									}}
									autoFocus
									className="w-full font-semibold text-sm bg-white border border-purple-300 rounded-lg px-2 py-1 focus:outline-none focus:border-purple-500 text-[#3d256b]"
								/>
							) : (
								<div
									className={`font-semibold text-sm ${
										selectedId === item.id
											? "text-[#3d1a70]"
											: "text-[#3d256b]"
									}`}
								>
									{index + 1}. {item.title || "未命名课程"}
								</div>
							)}
							<div
								className={`text-xs mt-1 ${
									selectedId === item.id
										? "text-[#5b4a7d]"
										: "text-[#8b7aa8]"
								}`}
							>
								{item.createdAt ? new Date(item.createdAt).toLocaleString() : "--"}
							</div>
							<div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
								<Button
									className="flex items-center justify-center w-7 h-7 rounded-lg bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] shadow-[var(--brand-shadow)] transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:scale-105"
									onClick={(e) => {
										e.stopPropagation();
										setEditingId(item.id);
										setEditingTitle(item.title || "");
									}}
									aria-label="重命名"
								>
									<EditOutlined className="text-xs" />
								</Button>
								<Button
									className="flex items-center justify-center w-7 h-7 rounded-lg bg-white border border-red-300/70 text-[#d43b3b] shadow-[0_4px_12px_rgba(239,68,68,0.18)] transition-[background,border-color,box-shadow,transform] hover:bg-red-50 hover:border-red-400 hover:scale-105"
									onClick={(e) => {
										e.stopPropagation();
										setDeleteConfirm({
											open: true,
											id: item.id,
											title: item.title || "未命名课程",
										});
									}}
									aria-label="删除"
								>
									<DeleteOutlined className="text-xs" />
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>

			<div
				className="absolute right-0 top-0 h-full w-[8px] cursor-col-resize hover:bg-purple-200/30 transition-colors"
				onMouseDown={startDrag}
				onTouchStart={startDrag}
				role="separator"
				aria-orientation="vertical"
				aria-label="Resize sidebar"
			>
				<div className="absolute right-[3px] top-20 h-[60%] w-[2px] rounded-full bg-purple-300/80" />
			</div>
			<ConfirmDialog
				open={deleteConfirm.open}
				title="确认删除"
				description={`确定要删除"${deleteConfirm.title}"吗？删除后无法恢复。`}
				confirmText="删除"
				cancelText="取消"
				danger
				onConfirm={() => {
					if (deleteConfirm.id) {
						window.dispatchEvent(
							new CustomEvent(deleteEventName, {
								detail: { id: deleteConfirm.id },
							})
						);
					}
					setDeleteConfirm({ open: false, id: null, title: "" });
				}}
				onCancel={() => setDeleteConfirm({ open: false, id: null, title: "" })}
			/>
			{ListModalComponent && (
				<Model
					visible={listModalOpen}
					onClose={() => setListModalOpen(false)}
					width={1100}
					showHeader={false}
					bodyClassName="p-2 max-h-[calc(90vh-24px)] overflow-auto"
				>
					<ListModalComponent
						items={listModalItems}
						onEdit={(id) => {
							if (id) {
								window.dispatchEvent(
									new CustomEvent(selectEventName, { detail: { id } })
								);
							}
							setListModalOpen(false);
						}}
						onCreate={handleModalCreate}
						onDelete={(id) => {
							window.dispatchEvent(
								new CustomEvent(deleteEventName, { detail: { id } })
							);
						}}
						onRename={persistRename}
						modalMode
						onCloseModal={() => setListModalOpen(false)}
						currentId={selectedId}
					/>
				</Model>
			)}
		</div>
	);
};

export default Sider;
