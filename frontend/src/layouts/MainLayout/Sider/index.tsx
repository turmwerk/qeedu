import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import List from "./List";
import ResizeHandle from "./ResizeHandle";
import DeleteConfirm from "./DeleteConfirm";
import ListModal, { type ListModalItem, type ListModalProps } from "./ListModal";
import {
	SYLLABUS_COUNTER_KEY,
	SYLLABUS_STORAGE_KEY,
} from "@/pages/Teaching/Syllabus/constants";
import { buildSyllabusMarkdown } from "@/pages/Teaching/Syllabus/utils/buildMarkdown";
import {
	EXAM_COUNTER_KEY,
	EXAM_STORAGE_KEY,
} from "@/pages/Teaching/ExamDesign/constants";

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
	buildCreatedItem?: (context: {
		id: string;
		createdAt: number;
		payload: Record<string, unknown>;
	}) => Record<string, unknown>;
	detailPathBuilder?: (id: string) => string;
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
	buildCreatedItem,
	detailPathBuilder,
}) => {
	const navigate = useNavigate();
	const [items, setItems] = useState<SiderItem[]>([]);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [width, setWidth] = useState(300);
	const [dragging, setDragging] = useState(false);
	const isDragging = useRef(false);
	const frameRef = useRef<number | null>(null);
	const pendingWidthRef = useRef<number | null>(null);
	const dragBodyStyleRef = useRef<{ cursor: string; userSelect: string } | null>(
		null,
	);
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

	const startDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
		event.preventDefault();
		isDragging.current = true;
		setDragging(true);
		if (event.currentTarget.setPointerCapture) {
			event.currentTarget.setPointerCapture(event.pointerId);
		}
		dragBodyStyleRef.current = {
			cursor: document.body.style.cursor,
			userSelect: document.body.style.userSelect,
		};
		document.body.style.cursor = "col-resize";
		document.body.style.userSelect = "none";
	}, []);

	const stopDrag = useCallback(() => {
		if (!isDragging.current) return;
		isDragging.current = false;
		setDragging(false);
		if (frameRef.current !== null) {
			window.cancelAnimationFrame(frameRef.current);
			frameRef.current = null;
		}
		pendingWidthRef.current = null;
		const previous = dragBodyStyleRef.current;
		document.body.style.cursor = previous?.cursor ?? "";
		document.body.style.userSelect = previous?.userSelect ?? "";
		dragBodyStyleRef.current = null;
	}, []);

	const onDrag = useCallback((clientX: number) => {
		if (!isDragging.current) return;
		const clamped = Math.min(420, Math.max(220, clientX));
		pendingWidthRef.current = clamped;
		if (frameRef.current !== null) return;
		frameRef.current = window.requestAnimationFrame(() => {
			frameRef.current = null;
			if (pendingWidthRef.current !== null) {
				setWidth(pendingWidthRef.current);
			}
		});
	}, []);


	useEffect(() => {
		const onWindowMove = (event: PointerEvent) => {
			if (!isDragging.current) return;
			onDrag(event.clientX);
		};
		const onWindowUp = () => stopDrag();
		window.addEventListener("pointermove", onWindowMove);
		window.addEventListener("pointerup", onWindowUp);
		window.addEventListener("pointercancel", onWindowUp);
		return () => {
			window.removeEventListener("pointermove", onWindowMove);
			window.removeEventListener("pointerup", onWindowUp);
			window.removeEventListener("pointercancel", onWindowUp);
			stopDrag();
		};
	}, [onDrag, stopDrag]);

	const actualWidth = open ? width : 0;
	const siderStyle = useMemo(
		() => ({
			width: `${actualWidth}px`,
			minWidth: `${actualWidth}px`,
			flexBasis: `${actualWidth}px`,
		}),
		[actualWidth]
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
		next.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
		return next;
	}, [items]);

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
			const counterKey =
				storageKey === SYLLABUS_STORAGE_KEY ? SYLLABUS_COUNTER_KEY : EXAM_COUNTER_KEY;
			let id = "1";
			try {
				const rawCounter = localStorage.getItem(counterKey);
				if (rawCounter) {
					const parsed = Number.parseInt(rawCounter, 10);
					id = String(Number.isNaN(parsed) ? 1 : parsed + 1);
				} else {
					const rawList = localStorage.getItem(storageKey);
					if (rawList) {
						const parsedList = JSON.parse(rawList) as Array<{ id?: string }>;
						const maxId = parsedList.reduce((max, item) => {
							const value = Number.parseInt(String(item.id ?? ""), 10);
							return Number.isNaN(value) ? max : Math.max(max, value);
						}, 0);
						id = String(maxId + 1);
					}
				}
				localStorage.setItem(counterKey, id);
			} catch {}
			const name =
				typeof payload.name === "string" && payload.name.trim()
					? payload.name.trim()
					: "未命名";
			const createdAt = Date.now();
			if (buildCreatedItem && detailPathBuilder) {
				const item = buildCreatedItem({ id, createdAt, payload });
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
					console.warn("create workspace item failed", e);
				}
				setListModalOpen(false);
				navigate(detailPathBuilder(id));
				return;
			}
			if (storageKey === SYLLABUS_STORAGE_KEY) {
				const md = buildSyllabusMarkdown(payload);
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
				setListModalOpen(false);
				navigate(`/teaching/syllabus/detail?outlineId=${encodeURIComponent(id)}`);
			} else if (storageKey === EXAM_STORAGE_KEY) {
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
				setListModalOpen(false);
				navigate(`/teaching/exam/detail?examId=${encodeURIComponent(id)}`);
			}
		},
		[
			buildCreatedItem,
			currentIdEventName,
			detailPathBuilder,
			navigate,
			storageKey,
			updatedEventName,
		]
	);

	return (
		<div
			className={`relative z-[10000] h-full shrink-0 overflow-hidden ${
				dragging ? "" : "transition-[width,min-width,flex-basis] duration-200 ease-out"
			}`}
			style={siderStyle}
			data-oid="syllabus-sider"
		>
			<div className="flex h-full min-w-0 flex-col bg-white/[0.58] dark:bg-white/[0.26] border-r-0 dark:border-r dark:border-r-white/[0.28] shadow-[0_8px_30px_rgba(120,90,200,0.14),inset_0_1px_0_rgba(255,255,255,0.74),inset_0_-1px_0_rgba(255,255,255,0.34)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(255,255,255,0.12)] backdrop-blur-[40px] backdrop-saturate-[210%]">
				<Header
					onSearch={() => setListModalOpen(true)}
					onCreate={() => window.dispatchEvent(new Event(createEventName))}
					onClose={onClose}
				/>
				<List
					items={items}
					sortedItems={sortedItems}
					selectedId={selectedId}
					editingId={editingId}
					editingTitle={editingTitle}
					emptyText={title}
					onSelect={(id) =>
						window.dispatchEvent(
							new CustomEvent(selectEventName, { detail: { id } })
						)
					}
					onStartEdit={(id, value) => {
						setEditingId(id);
						setEditingTitle(value);
					}}
					onChangeEdit={(value) => setEditingTitle(value)}
					onCommitEdit={(id, value) => persistRename(id, value)}
					onCancelEdit={() => setEditingId(null)}
					onDelete={(id, itemTitle) =>
						setDeleteConfirm({ open: true, id, title: itemTitle })
					}
				/>
			</div>

			<ResizeHandle onStartDrag={startDrag} />
			<DeleteConfirm
				open={deleteConfirm.open}
				title={deleteConfirm.title}
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
			<ListModal
				open={listModalOpen}
				onClose={() => setListModalOpen(false)}
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
				currentId={selectedId}
				ListModalComponent={ListModalComponent}
			/>
		</div>
	);
};

export default Sider;
