import React, { useEffect, useMemo, useRef, useState } from "react";
import { BookOutlined, SortAscendingOutlined, SortDescendingOutlined, EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import Dropdown from "@/components/Dropdown";
import ConfirmDialog from "@/components/ConfirmDialog";

type Outline = {
	id: string;
	title: string;
	createdAt?: number;
};

type Props = {
	open: boolean;
	onClose: () => void;
};

const STORAGE_KEY = "syllabus_outlines";

const Sider: React.FC<Props> = ({ open, onClose }) => {
	const [items, setItems] = useState<Outline[]>([]);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [sortBy, setSortBy] = useState<"time" | "name">("time");
	const [order, setOrder] = useState<"asc" | "desc">("asc");
	const [width, setWidth] = useState(300);
	const isDragging = useRef(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingTitle, setEditingTitle] = useState("");
	const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string | null; title: string }>({ open: false, id: null, title: "" });

	useEffect(() => {
		const load = () => {
			try {
				const raw = localStorage.getItem(STORAGE_KEY);
				if (raw) setItems(JSON.parse(raw));
			} catch {
				setItems([]);
			}
		};
		load();
		const onStorage = () => load();
		const onCustom = () => load();
		const onSelect = (event: Event) => {
			const detail = (event as CustomEvent<{ id?: string }>).detail;
			if (detail?.id) setSelectedId(detail.id);
		};
		window.addEventListener("storage", onStorage);
		window.addEventListener("syllabus-outlines-updated", onCustom as EventListener);
		window.addEventListener("syllabus-current-id", onSelect as EventListener);
		return () => {
			window.removeEventListener("storage", onStorage);
			window.removeEventListener(
				"syllabus-outlines-updated",
				onCustom as EventListener
			);
			window.removeEventListener("syllabus-current-id", onSelect as EventListener);
		};
	}, []);

	const startDrag = () => {
		isDragging.current = true;
	};

	const stopDrag = () => {
		isDragging.current = false;
	};

	const onDrag = (clientX: number) => {
		if (!isDragging.current) return;
		const clamped = Math.min(420, Math.max(220, clientX));
		setWidth(clamped);
		// 通知 MarkdownEditor 宽度变化
		window.dispatchEvent(
			new CustomEvent("syllabus-sider-width", {
				detail: { width: clamped },
			})
		);
	};

	const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		if (!isDragging.current) return;
		onDrag(event.clientX);
	};

	const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
		if (!isDragging.current) return;
		onDrag(event.touches[0].clientX);
	};

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
	}, []);

	const actualWidth = open ? width : 0;
	const style = useMemo(
		() => ({ width: actualWidth, minWidth: actualWidth }),
		[actualWidth]
	);

	useEffect(() => {
		window.dispatchEvent(
			new CustomEvent("syllabus-sider-width", {
				detail: { width: actualWidth },
			})
		);
	}, [actualWidth]);

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

	return (
		<div
			className="relative h-screen z-[10000] transition-all duration-300 ease-out overflow-hidden"
			style={style}
			data-oid="syllabus-sider"
		>
			<div className="h-full bg-white/70 backdrop-blur-[18px] shadow-[0_12px_40px_rgba(124,58,237,0.2)] border-r border-white/60 flex flex-col">
				<div className="flex items-center justify-between px-4 py-3 border-b border-white/50">
					<div className="flex items-center gap-2 font-bold text-[#2d1b4f]">
						<span className="w-7 h-7 rounded-lg bg-white/80 border border-white/60 shadow-[0_6px_18px_rgba(124,58,237,0.18)] flex items-center justify-center text-[#5b35b7]">
							<BookOutlined />
						</span>
						大纲列表
					</div>
					<div className="flex items-center gap-2">
						<div className="relative group">
							<button className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/80 border border-white/60 shadow-[0_6px_18px_rgba(124,58,237,0.18)] text-[#5b35b7] hover:brightness-110 transition">
								排序
							</button>
							<div className="absolute right-0 top-[calc(100%+4px)] bg-white/90 backdrop-blur-[20px] rounded-xl p-2 min-w-[120px] shadow-[0_8px_32px_rgba(147,51,234,0.15)] border border-white/40 opacity-0 -translate-y-1.5 pointer-events-none z-10 flex flex-col transition-[opacity,transform] [transition:opacity_200ms_ease_500ms,transform_200ms_ease_500ms] group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-hover:[transition-delay:0ms]">
								<button
									className={`bg-transparent border-0 text-left w-full px-3 py-2 rounded-lg cursor-pointer text-[#1f1f1f] hover:bg-[var(--brand-accent-soft)] flex items-center justify-between ${
										sortBy === "time" ? "bg-purple-50" : ""
									}`}
									onClick={() => setSortBy("time")}
								>
									<span>按时间</span>
									{sortBy === "time" && <CheckOutlined className="text-[#5b35b7]" />}
								</button>
								<button
									className={`bg-transparent border-0 text-left w-full px-3 py-2 rounded-lg cursor-pointer text-[#1f1f1f] hover:bg-[var(--brand-accent-soft)] flex items-center justify-between ${
										sortBy === "name" ? "bg-purple-50" : ""
									}`}
									onClick={() => setSortBy("name")}
								>
									<span>按名称</span>
									{sortBy === "name" && <CheckOutlined className="text-[#5b35b7]" />}
								</button>
							</div>
						</div>
						<button
							className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/80 border border-white/60 shadow-[0_6px_18px_rgba(124,58,237,0.18)] text-[#5b35b7] hover:brightness-110 transition"
							onClick={() => setOrder((v) => (v === "asc" ? "desc" : "asc"))}
							aria-label="切换排序"
						>
							{order === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
						</button>
						<button
							className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/80 border border-white/60 shadow-[0_6px_18px_rgba(124,58,237,0.18)] text-[#5b35b7] hover:brightness-110 transition"
							onClick={onClose}
							aria-label="关闭侧边栏"
						>
							收起
						</button>
					</div>
				</div>
				<div className="flex-1 overflow-y-auto p-3 space-y-2">
					{items.length === 0 && (
						<div className="text-[#7d6b9a] text-sm px-2 py-4">暂无课程大纲</div>
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
									new CustomEvent("syllabus-outline-select", {
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
									onBlur={() => {
										if (editingTitle.trim()) {
											const updated = items.map((o) =>
												o.id === item.id ? { ...o, title: editingTitle.trim() } : o
											);
											localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
											setItems(updated);
											window.dispatchEvent(new Event("syllabus-outlines-updated"));
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
								<div className={`font-semibold text-sm ${selectedId === item.id ? "text-[#3d1a70]" : "text-[#3d256b]"}`}>
									{index + 1}. {item.title || "未命名课程"}
								</div>
							)}
							<div className={`text-xs mt-1 ${selectedId === item.id ? "text-[#5b4a7d]" : "text-[#8b7aa8]"}`}>
								{item.createdAt
									? new Date(item.createdAt).toLocaleString()
									: "--"}
							</div>
							<div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
								<button
									className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/90 border border-purple-300/60 shadow-[0_4px_12px_rgba(124,58,237,0.2)] text-[#5b35b7] hover:bg-purple-50 hover:scale-110 transition-all"
									onClick={(e) => {
										e.stopPropagation();
										setEditingId(item.id);
										setEditingTitle(item.title || "");
									}}
									aria-label="重命名"
								>
									<EditOutlined className="text-xs" />
								</button>
								<button
									className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/90 border border-red-300/60 shadow-[0_4px_12px_rgba(220,38,38,0.2)] text-red-500 hover:bg-red-50 hover:scale-110 transition-all"
									onClick={(e) => {
										e.stopPropagation();
										setDeleteConfirm({ open: true, id: item.id, title: item.title || "未命名课程" });
									}}
									aria-label="删除"
								>
									<DeleteOutlined className="text-xs" />
								</button>
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
				description={`确定要删除大纲"${deleteConfirm.title}"吗？删除后无法恢复。`}
				confirmText="删除"
				cancelText="取消"
				danger
				onConfirm={() => {
					if (deleteConfirm.id) {
						window.dispatchEvent(
							new CustomEvent("syllabus-outline-delete", {
								detail: { id: deleteConfirm.id },
							})
						);
					}
					setDeleteConfirm({ open: false, id: null, title: "" });
				}}
				onCancel={() => setDeleteConfirm({ open: false, id: null, title: "" })}
			/>
		</div>
	);
};

export default Sider;
