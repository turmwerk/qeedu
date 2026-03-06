import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Dialog from "@/feature/ChatDialog";
import ListPage from "../ListPage";
import DetailPage from "../DetailPage";
import CreateModal from "../CreateModal";

type Question = {
	id: string;
	stem: string;
	score?: number;
	type?: string;
	options?: string[];
	knowledge?: string;
	difficulty?: string;
	cognition?: string;
	answerAnalysis?: string;
};

type Exam = {
	id: string;
	title: string;
	questions: Question[];
	createdAt?: number;
};

const STORAGE_KEY = "exam_design_exams_v1";
const CURRENT_KEY = "exam_design_current_id";
const COUNTER_KEY = "exam_design_exams_counter";

export const ListRoute: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [exams, setExams] = useState<Exam[]>(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) return JSON.parse(raw) as Exam[];
			return [];
		} catch (e) {
			console.error("load exams", e);
			return [];
		}
	});

	const persist = useCallback((next: Exam[]) => {
		setExams(next);
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
			window.dispatchEvent(new Event("exam-exams-updated"));
		} catch (e) {
			console.error("save exams", e);
		}
	}, []);

	const [openSignal, setOpenSignal] = useState(0);

	useEffect(() => {
		const openCreate = (location.state as { openCreate?: boolean } | null)
			?.openCreate;
		if (openCreate) {
			setOpenSignal((v) => v + 1);
			navigate(location.pathname, { replace: true, state: {} });
		}
	}, [location.pathname, location.state, navigate]);

	const setCurrentId = useCallback((id: string) => {
		try {
			localStorage.setItem(CURRENT_KEY, id);
			window.dispatchEvent(
				new CustomEvent("exam-current-id", { detail: { id } })
			);
		} catch (e) {
			console.warn("set current exam id failed", e);
		}
	}, []);

	const getNextId = useCallback(() => {
		let next = 1;
		try {
			const rawCounter = localStorage.getItem(COUNTER_KEY);
			if (rawCounter) {
				const parsed = Number.parseInt(rawCounter, 10);
				next = Number.isNaN(parsed) ? 1 : parsed + 1;
			} else {
				const rawList = localStorage.getItem(STORAGE_KEY);
				if (rawList) {
					const parsedList = JSON.parse(rawList) as Array<{ id?: string }>;
					const maxId = parsedList.reduce((max, item) => {
						const value = Number.parseInt(String(item.id ?? ""), 10);
						return Number.isNaN(value) ? max : Math.max(max, value);
					}, 0);
					next = maxId + 1;
				}
			}
			localStorage.setItem(COUNTER_KEY, String(next));
		} catch {}
		return String(next);
	}, []);

	const handleCreate = useCallback(
		(payload: Record<string, unknown>) => {
			const id = getNextId();
			const name =
				typeof payload.name === "string" && payload.name.trim()
					? payload.name
					: "未命名试卷";
			const item: Exam = {
				id,
				title: name,
				questions: [],
				createdAt: Date.now(),
			};
			const next = [item, ...exams];
			persist(next);
			setCurrentId(id);
			navigate(`/teaching/exam/detail?examId=${encodeURIComponent(id)}`);
		},
		[getNextId, exams, navigate, persist, setCurrentId]
	);

	const handleDelete = useCallback(
		(id: string) => {
			const target = exams.find((e) => e.id === id);
			const next = exams.filter((e) => e.id !== id);
			persist(next);
			try {
				Dialog.clearDialog(id);
				if (target) {
					target.questions.forEach((q) => Dialog.clearDialog(`${id}-q-${q.id}`));
				}
			} catch (e) {
				console.warn("clear exam dialogs failed", e);
			}
			try {
				const currentId = localStorage.getItem(CURRENT_KEY);
				if (currentId === id) {
					localStorage.removeItem(CURRENT_KEY);
				}
			} catch (e) {
				console.warn("clear current exam id failed", e);
			}
		},
		[exams, persist]
	);

	const handleRename = useCallback(
		(id: string, newName?: string) => {
			if (!newName) return;
			const next = exams.map((ex) =>
				ex.id === id ? { ...ex, title: newName || ex.title } : ex,
			);
			persist(next);
		},
		[exams, persist]
	);

	const goDetail = useCallback(
		(id?: string) => {
			const nextId = id || exams[0]?.id;
			if (!nextId) return;
			setCurrentId(nextId);
			navigate(`/teaching/exam/detail?examId=${encodeURIComponent(nextId)}`);
		},
		[exams, navigate, setCurrentId]
	);

	return (
		<ListPage
			items={exams.map((e) => ({
				id: e.id,
				title: e.title,
				subtitle: "",
				createdAt: e.createdAt,
			}))}
			onEdit={(id) => goDetail(id)}
			onCreate={handleCreate}
			onDelete={(id) => id && handleDelete(id)}
			onRename={(id, newName) => id && newName && handleRename(id, newName)}
			openSignal={openSignal}
		/>
	);
};

export const DetailRoute: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [exams, setExams] = useState<Exam[]>(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) return JSON.parse(raw) as Exam[];
			return [];
		} catch (e) {
			console.error("load exams", e);
			return [];
		}
	});
	const [manualId, setManualId] = useState<string | null>(null);
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [loaded, setLoaded] = useState(false);

	const loadExams = useCallback(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) setExams(JSON.parse(raw));
			else setExams([]);
		} catch (e) {
			console.error("load exams", e);
			setExams([]);
		}
	}, []);

	const persist = useCallback((next: Exam[]) => {
		setExams(next);
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
			window.dispatchEvent(new Event("exam-exams-updated"));
		} catch (e) {
			console.error("save exams", e);
		}
	}, []);

	useEffect(() => {
		const onCustom = () => loadExams();
		window.addEventListener("exam-exams-updated", onCustom as EventListener);
		return () => {
			window.removeEventListener(
				"exam-exams-updated",
				onCustom as EventListener
			);
		};
	}, [loadExams]);

	useEffect(() => {
		loadExams();
		setLoaded(true);
	}, [loadExams]);

	const queryId = useMemo(
		() => new URLSearchParams(location.search).get("examId"),
		[location.search]
	);
	const fallbackId = useMemo(() => {
		if (queryId) return queryId;
		try {
			const savedId = localStorage.getItem(CURRENT_KEY);
			if (savedId) return savedId;
		} catch (e) {
			console.warn("read current exam id failed", e);
		}
		return exams[0]?.id || null;
	}, [exams, queryId]);

	const currentId = manualId || fallbackId;

	useEffect(() => {
		if (!manualId && queryId) {
			setManualId(queryId);
		}
	}, [manualId, queryId]);

	useEffect(() => {
		if (!loaded) return;
		if (!currentId && exams.length === 0) {
			navigate("/teaching/exam/ListPage");
		}
	}, [currentId, exams.length, loaded, navigate]);

	useEffect(() => {
		if (!currentId) return;
		try {
			localStorage.setItem(CURRENT_KEY, currentId);
		} catch (e) {
			console.warn("save current exam id failed", e);
		}
		window.dispatchEvent(
			new CustomEvent("exam-current-id", { detail: { id: currentId } })
		);
	}, [currentId]);

	useEffect(() => {
		if (!currentId) return;
		const params = new URLSearchParams(location.search);
		if (params.get("examId") !== currentId) {
			params.set("examId", currentId);
			navigate(`/teaching/exam/detail?${params.toString()}`, { replace: true });
		}
	}, [currentId, location.search, navigate]);

	const current = useMemo(
		() => exams.find((e) => e.id === currentId),
		[exams, currentId]
	);

	useEffect(() => {
		if (!loaded) return;
		if (currentId && !current) {
			if (exams[0]) {
				setManualId(exams[0].id);
				return;
			}
			navigate("/teaching/exam/ListPage");
		}
	}, [current, currentId, exams, loaded, navigate]);

	const handleDelete = useCallback(
		(id: string) => {
			const target = exams.find((e) => e.id === id);
			const next = exams.filter((e) => e.id !== id);
			persist(next);
			try {
				Dialog.clearDialog(id);
				if (target) {
					target.questions.forEach((q) => Dialog.clearDialog(`${id}-q-${q.id}`));
				}
			} catch (e) {
				console.warn("clear exam dialogs failed", e);
			}
			if (currentId === id) {
				if (next[0]) {
					setManualId(next[0].id);
				} else {
					setManualId(null);
					try {
						localStorage.removeItem(CURRENT_KEY);
					} catch (e) {
						console.warn("clear current exam id failed", e);
					}
					navigate("/teaching/exam/ListPage");
				}
			}
		},
		[currentId, exams, navigate, persist]
	);

	const getNextId = useCallback(() => {
		let next = 1;
		try {
			const rawCounter = localStorage.getItem(COUNTER_KEY);
			if (rawCounter) {
				const parsed = Number.parseInt(rawCounter, 10);
				next = Number.isNaN(parsed) ? 1 : parsed + 1;
			} else {
				const rawList = localStorage.getItem(STORAGE_KEY);
				if (rawList) {
					const parsedList = JSON.parse(rawList) as Array<{ id?: string }>;
					const maxId = parsedList.reduce((max, item) => {
						const value = Number.parseInt(String(item.id ?? ""), 10);
						return Number.isNaN(value) ? max : Math.max(max, value);
					}, 0);
					next = maxId + 1;
				}
			}
			localStorage.setItem(COUNTER_KEY, String(next));
		} catch {}
		return String(next);
	}, []);

	const handleCreate = useCallback(
		(payload: Record<string, any>) => {
			const id = getNextId();
			const name =
				typeof payload.name === "string" && payload.name.trim()
					? payload.name
					: "未命名试卷";
			const item: Exam = {
				id,
				title: name,
				questions: [],
				createdAt: Date.now(),
			};
			const next = [item, ...exams];
			persist(next);
			setManualId(id);
		},
		[getNextId, exams, persist]
	);

	useEffect(() => {
		const onSelect = (event: Event) => {
			const detail = (event as CustomEvent<{ id?: string }>).detail;
			if (detail?.id && detail.id !== manualId) setManualId(detail.id);
		};
		const onDelete = (event: Event) => {
			const detail = (event as CustomEvent<{ id?: string }>).detail;
			if (detail?.id) handleDelete(detail.id);
		};
		const onCreate = () => {
			setCreateModalOpen(true);
		};
		window.addEventListener("exam-exam-select", onSelect as EventListener);
		window.addEventListener("exam-exam-delete", onDelete as EventListener);
		window.addEventListener("exam-exam-create", onCreate);
		return () => {
			window.removeEventListener("exam-exam-select", onSelect as EventListener);
			window.removeEventListener("exam-exam-delete", onDelete as EventListener);
			window.removeEventListener("exam-exam-create", onCreate);
		};
	}, [handleDelete, manualId]);

	if (!current) {
		return null;
	}

	return (
		<>
			<DetailPage
				examId={current?.id}
				title={current?.title}
				questions={current?.questions}
				onBack={() => {
					navigate("/teaching/exam/ListPage");
				}}
			/>
			<CreateModal
				open={createModalOpen}
				onClose={() => setCreateModalOpen(false)}
				onCreate={handleCreate}
			/>
		</>
	);
};
