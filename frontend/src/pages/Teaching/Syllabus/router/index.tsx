import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Dialog from "@/components/Dialog";
import ListPage from "../ListPage";
import DetailPage from "../DetailPage";
import CreateModal from "../components/CreateModal";

type Outline = {
	id: string;
	title: string;
	subtitle?: string;
	md: string;
	createdAt?: number;
};

const STORAGE_KEY = "syllabus_outlines";
const CURRENT_KEY = "syllabus_current_id";
const COUNTER_KEY = "syllabus_outlines_counter";

export const ListRoute: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [outlines, setOutlines] = useState<Outline[]>([]);
	const [openSignal, setOpenSignal] = useState(0);

	const loadOutlines = useCallback(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				setOutlines(JSON.parse(raw));
			} else {
				setOutlines([]);
			}
		} catch (e) {
			console.error("load outlines", e);
			setOutlines([]);
		}
	}, []);

	useEffect(() => {
		loadOutlines();
		const onCustom = () => loadOutlines();
		window.addEventListener(
			"syllabus-outlines-updated",
			onCustom as EventListener
		);
		return () => {
			window.removeEventListener(
				"syllabus-outlines-updated",
				onCustom as EventListener
			);
		};
	}, [loadOutlines]);

	useEffect(() => {
		const openCreate = (location.state as { openCreate?: boolean } | null)
			?.openCreate;
		if (openCreate) {
			setOpenSignal((v) => v + 1);
			navigate(location.pathname, { replace: true, state: {} });
		}
	}, [location.pathname, location.state, navigate]);

	const persist = useCallback((next: Outline[]) => {
		setOutlines(next);
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
			window.dispatchEvent(new Event("syllabus-outlines-updated"));
		} catch (e) {
			console.error("save outlines", e);
		}
	}, []);

	const setCurrentId = useCallback((id: string) => {
		try {
			localStorage.setItem(CURRENT_KEY, id);
		} catch {}
		window.dispatchEvent(
			new CustomEvent("syllabus-current-id", { detail: { id } })
		);
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
		(payload: Record<string, any>) => {
			const id = getNextId();
			const name = payload.name || "未命名课程";
			const englishName = payload.englishName || "Untitled Course";
			const courseId = payload.courseId || "00000000";
			const unit = payload.unit || "计算机学院";
			const responsible = payload.responsible || "待定";

			const credits = payload.credits || 3;
			const totalHours = payload.totalHours || 48;
			const theoryHours = payload.theoryHours || 32;
			const practiceHours = payload.practiceHours || totalHours - theoryHours;
			const experimentHours = payload.experimentHours || 0;
			const intensiveWeeks = payload.intensiveWeeks || 0;
			const weeklyHours = (totalHours / 16).toFixed(1);

			const goals = payload.goals || "暂无目标";
			const teachingGoals = payload.teachingGoals || "...";
			const alignmentGoals = payload.alignmentGoals || "...";
			const intro = payload.intro || "...";
			const textbooks = payload.textbooks || "...";
			const references = payload.references || "...";
			const grading = payload.grading || "...";

			const publicElectiveCategory = payload.publicElectiveCategory || "--";
			const generalEducationCategory = payload.generalEducationCategory || "--";
			const collegeCourseCategory = payload.collegeCourseCategory || "--";
			const courseLevel = payload.courseLevel || "--";
			const theoryPracticeType = payload.theoryPracticeType || "理论+实验课程";
			const examType = payload.examType || "闭卷";
			const writerName = payload.writerName || "--";
			const courseCategory = payload.courseCategory || "学科基础课程";
			const courseStatus = payload.courseStatus || "运行中";
			const crossSemester = payload.crossSemester || "否";
			const isEnglish = payload.isEnglish || "否";
			const isBilingual = payload.isBilingual || "否";

			const mdText = `# ${name}

## 课程基本信息

<table>
	<tr>
		<td width="15%">开课单位</td>
		<td width="35%">${unit}</td>
		<td width="15%">通识公选类别</td>
		<td width="35%">${publicElectiveCategory}</td>
	</tr>
	<tr>
		<td>通修课程类别</td>
		<td>${generalEducationCategory}</td>
		<td>院内课程分类</td>
		<td>${collegeCourseCategory}</td>
	</tr>
	<tr>
		<td>课程层次</td>
		<td>${courseLevel}</td>
		<td>理论/实践</td>
		<td>${theoryPracticeType}</td>
	</tr>
	<tr>
		<td>考试类型</td>
		<td>${examType}</td>
		<td>课程号</td>
		<td>${courseId}</td>
	</tr>
	<tr>
		<td>课程名</td>
		<td>${name}</td>
		<td>英文课程名</td>
		<td>${englishName}</td>
	</tr>
	<tr>
		<td>大纲填写人姓名</td>
		<td>${writerName}</td>
		<td>课程类别</td>
		<td>${courseCategory}</td>
	</tr>
	<tr>
		<td>课程状态</td>
		<td>${courseStatus}</td>
		<td>课程负责人姓名</td>
		<td>${responsible}</td>
	</tr>
	<tr>
		<td>跨学期课程</td>
		<td colspan="3">${crossSemester}</td>
	</tr>
</table>

## 课程学时信息

<table>
	<tr>
		<td width="15%">学分</td>
		<td width="35%">${credits}</td>
		<td width="15%">总学时</td>
		<td width="35%">${totalHours}</td>
	</tr>
	<tr>
		<td>周学时</td>
		<td>${weeklyHours}</td>
		<td>实验学时</td>
		<td>${experimentHours}</td>
	</tr>
	<tr>
		<td>实践学时</td>
		<td>${practiceHours}</td>
		<td>理论学时</td>
		<td>${theoryHours}</td>
	</tr>
	<tr>
		<td>集中实践周数</td>
		<td colspan="3">${intensiveWeeks}</td>
	</tr>
</table>

## 课程详细信息

<table>
	<tr>
		<td width="15%">是否全英文授课</td>
		<td width="35%">${isEnglish}</td>
		<td width="15%">是否双语授课</td>
		<td width="35%">${isBilingual}</td>
	</tr>
	<tr>
		<td>课程育人目标</td>
		<td colspan="3">${goals}</td>
	</tr>
	<tr>
		<td>课程教学目标</td>
		<td colspan="3">${teachingGoals}</td>
	</tr>
	<tr>
		<td>与学校本科人才培养目标的契合关系</td>
		<td colspan="3">${alignmentGoals}</td>
	</tr>
	<tr>
		<td>课程简介</td>
		<td colspan="3">${intro}</td>
	</tr>
	<tr>
		<td>教材</td>
		<td colspan="3">${textbooks}</td>
	</tr>
	<tr>
		<td>参考资料</td>
		<td colspan="3">${references}</td>
	</tr>
	<tr>
		<td>成绩构成</td>
		<td colspan="3">${grading}</td>
	</tr>
</table>
`;

			const item: Outline = {
				id,
				title: name,
				md: mdText,
				createdAt: Date.now(),
			};
			const next = [item, ...outlines];
			persist(next);
			setCurrentId(id);
			navigate(`/teaching/syllabus/detail?outlineId=${encodeURIComponent(id)}`);
		},
		[getNextId, navigate, outlines, persist, setCurrentId]
	);

	const handleDelete = useCallback(
		(id: string) => {
			const next = outlines.filter((o) => o.id !== id);
			persist(next);
			Dialog.clearDialog(id);
		},
		[outlines, persist]
	);

	const handleRename = useCallback(
		(id: string, newName?: string) => {
			if (!newName) return;
			const next = outlines.map((o) =>
				o.id === id ? { ...o, title: newName } : o,
			);
			persist(next);
		},
		[outlines, persist]
	);

	const goDetail = useCallback(
		(id?: string) => {
			const nextId = id || outlines[0]?.id;
			if (!nextId) return;
			setCurrentId(nextId);
			navigate(`/teaching/syllabus/detail?outlineId=${encodeURIComponent(nextId)}`);
		},
		[navigate, outlines, setCurrentId]
	);

	useEffect(() => {
		const onSelect = (event: Event) => {
			const detail = (event as CustomEvent<{ id?: string }>).detail;
			if (detail?.id) setCurrentId(detail.id);
		};
		const onDelete = (event: Event) => {
			const detail = (event as CustomEvent<{ id?: string }>).detail;
			if (detail?.id) handleDelete(detail.id);
		};
		const onCreate = () => {
			navigate("/teaching/syllabus/ListPage", { state: { openCreate: true } });
		};
		window.addEventListener(
			"syllabus-outline-select",
			onSelect as EventListener
		);
		window.addEventListener(
			"syllabus-outline-delete",
			onDelete as EventListener
		);
		window.addEventListener("syllabus-outline-create", onCreate);
		return () => {
			window.removeEventListener(
				"syllabus-outline-select",
				onSelect as EventListener
			);
			window.removeEventListener(
				"syllabus-outline-delete",
				onDelete as EventListener
			);
			window.removeEventListener("syllabus-outline-create", onCreate);
		};
	}, [handleDelete, navigate]);

	return (
		<ListPage
			items={outlines.map((o) => ({
				id: o.id,
				title: o.title,
				subtitle: o.subtitle,
				md: o.md,
				createdAt: o.createdAt,
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
	const [outlines, setOutlines] = useState<Outline[]>([]);
	const [currentId, setCurrentId] = useState<string | null>(null);
	const [md, setMd] = useState("");
	const [openFull, setOpenFull] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [createModalOpen, setCreateModalOpen] = useState(false);

	const loadOutlines = useCallback(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				setOutlines(JSON.parse(raw));
			} else {
				setOutlines([]);
			}
		} catch (e) {
			console.error("load outlines", e);
			setOutlines([]);
		}
	}, []);

	useEffect(() => {
		loadOutlines();
		setLoaded(true);
		const onCustom = () => loadOutlines();
		window.addEventListener(
			"syllabus-outlines-updated",
			onCustom as EventListener
		);
		return () => {
			window.removeEventListener(
				"syllabus-outlines-updated",
				onCustom as EventListener
			);
		};
	}, [loadOutlines]);

	useEffect(() => {
		if (currentId) return;
		const queryId = new URLSearchParams(location.search).get("outlineId");
		if (queryId) {
			setCurrentId(queryId);
			return;
		}
		try {
			const savedId = localStorage.getItem(CURRENT_KEY);
			if (savedId) {
				setCurrentId(savedId);
				return;
			}
		} catch {}
		if (outlines[0]) {
			setCurrentId(outlines[0].id);
			return;
		}
		if (loaded && outlines.length === 0) {
			navigate("/teaching/syllabus/ListPage");
		}
	}, [currentId, location.search, outlines, navigate, loaded]);

	useEffect(() => {
		if (!currentId) return;
		const params = new URLSearchParams(location.search);
		if (params.get("outlineId") !== currentId) {
			params.set("outlineId", currentId);
			navigate(`/teaching/syllabus/detail?${params.toString()}`, { replace: true });
		}
	}, [currentId, location.search, navigate]);

	const persist = useCallback((next: Outline[]) => {
		setOutlines(next);
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
			window.dispatchEvent(new Event("syllabus-outlines-updated"));
		} catch (e) {
			console.error("save outlines", e);
		}
	}, []);

	useEffect(() => {
		if (!currentId) return;
		const found = outlines.find((o) => o.id === currentId);
		if (found) {
			setMd(found.md);
			try {
				localStorage.setItem(CURRENT_KEY, currentId);
			} catch {}
			window.dispatchEvent(
				new CustomEvent("syllabus-current-id", { detail: { id: currentId } })
			);
		}
	}, [currentId, outlines]);

	const currentOutline = useMemo(
		() => outlines.find((o) => o.id === currentId),
		[outlines, currentId]
	);

	const handleDelete = useCallback(
		(id: string) => {
			const next = outlines.filter((o) => o.id !== id);
			persist(next);
			Dialog.clearDialog(id);
			if (currentId === id) {
				if (next[0]) {
					setCurrentId(next[0].id);
				} else {
					setCurrentId(null);
					try {
						localStorage.removeItem(CURRENT_KEY);
					} catch {}
					navigate("/teaching/syllabus/ListPage");
				}
			}
		},
		[currentId, navigate, outlines, persist]
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
			const name = payload.name || "未命名课程";
			const englishName = payload.englishName || "Untitled Course";
			const courseId = payload.courseId || "00000000";
			const unit = payload.unit || "计算机学院";
			const responsible = payload.responsible || "待定";

			const credits = payload.credits || 3;
			const totalHours = payload.totalHours || 48;
			const theoryHours = payload.theoryHours || 32;
			const practiceHours = payload.practiceHours || totalHours - theoryHours;
			const experimentHours = payload.experimentHours || 0;
			const intensiveWeeks = payload.intensiveWeeks || 0;
			const weeklyHours = (totalHours / 16).toFixed(1);

			const goals = payload.goals || "暂无目标";
			const teachingGoals = payload.teachingGoals || "...";
			const alignmentGoals = payload.alignmentGoals || "...";
			const intro = payload.intro || "...";
			const textbooks = payload.textbooks || "...";
			const references = payload.references || "...";
			const grading = payload.grading || "...";

			const publicElectiveCategory = payload.publicElectiveCategory || "--";
			const generalEducationCategory = payload.generalEducationCategory || "--";
			const collegeCourseCategory = payload.collegeCourseCategory || "--";
			const courseLevel = payload.courseLevel || "--";
			const theoryPracticeType = payload.theoryPracticeType || "理论+实验课程";
			const examType = payload.examType || "闭卷";
			const writerName = payload.writerName || "--";
			const courseCategory = payload.courseCategory || "学科基础课程";
			const courseStatus = payload.courseStatus || "运行中";
			const crossSemester = payload.crossSemester || "否";
			const isEnglish = payload.isEnglish || "否";
			const isBilingual = payload.isBilingual || "否";

			const mdContent = `# 课程大纲

## 课程基本信息

| 项目 | 内容 | 项目 | 内容 |
| :--- | :--- | :--- | :--- |
| **开课单位** | ${unit} | **通识公选类别** | ${publicElectiveCategory} |
| **通修课程类别** | ${generalEducationCategory} | **院内课程分类** | ${collegeCourseCategory} |
| **课程层次** | ${courseLevel} | **理论/实践** | ${theoryPracticeType} |
| **考试类型** | ${examType} | **课程号** | ${courseId} |
| **课程名** | ${name} | **英文课程名** | ${englishName} |
| **大纲填写人姓名** | ${writerName} | **课程类别** | ${courseCategory} |
| **课程状态** | ${courseStatus} | **课程负责人姓名** | ${responsible} |
| **跨学期课程** | ${crossSemester} | | |

## 课程学时信息

| 项目 | 内容 | 项目 | 内容 |
| :--- | :--- | :--- | :--- |
| **学分** | ${credits} | **总学时** | ${totalHours} |
| **周学时** | ${weeklyHours} | **实验学时** | ${experimentHours} |
| **实践学时** | ${practiceHours} | **理论学时** | ${theoryHours} |
| **集中实践周数** | ${intensiveWeeks} | | |

## 课程详细信息

<table>
	<tr>
		<td width="15%"><strong>是否全英文授课</strong></td>
		<td width="35%">${isEnglish}</td>
		<td width="15%"><strong>是否双语授课</strong></td>
		<td width="35%">${isBilingual}</td>
	</tr>
	<tr>
		<td><strong>课程育人目标</strong></td>
		<td colspan="3">${goals}</td>
	</tr>
	<tr>
		<td><strong>课程教学目标</strong></td>
		<td colspan="3">${teachingGoals}</td>
	</tr>
	<tr>
		<td><strong>与学校本科人才培养目标的契合关系</strong></td>
		<td colspan="3">${alignmentGoals}</td>
	</tr>
	<tr>
		<td><strong>课程简介</strong></td>
		<td colspan="3">${intro}</td>
	</tr>
	<tr>
		<td><strong>教材</strong></td>
		<td colspan="3">${textbooks}</td>
	</tr>
	<tr>
		<td><strong>参考资料</strong></td>
		<td colspan="3">${references}</td>
	</tr>
	<tr>
		<td><strong>成绩构成</strong></td>
		<td colspan="3">${grading}</td>
	</tr>
</table>
`;

			const item: Outline = {
				id,
				title: name,
				md: mdContent,
				createdAt: Date.now(),
			};
			const next = [item, ...outlines];
			persist(next);
			setCurrentId(id);
		},
		[getNextId, outlines, persist]
	);

	useEffect(() => {
		const onSelect = (event: Event) => {
			const detail = (event as CustomEvent<{ id?: string }>).detail;
			if (detail?.id && detail.id !== currentId) setCurrentId(detail.id);
		};
		const onDelete = (event: Event) => {
			const detail = (event as CustomEvent<{ id?: string }>).detail;
			if (detail?.id) handleDelete(detail.id);
		};
		const onCreate = () => {
			setCreateModalOpen(true);
		};
		window.addEventListener(
			"syllabus-outline-select",
			onSelect as EventListener
		);
		window.addEventListener(
			"syllabus-outline-delete",
			onDelete as EventListener
		);
		window.addEventListener("syllabus-outline-create", onCreate);
		return () => {
			window.removeEventListener(
				"syllabus-outline-select",
				onSelect as EventListener
			);
			window.removeEventListener(
				"syllabus-outline-delete",
				onDelete as EventListener
			);
			window.removeEventListener("syllabus-outline-create", onCreate);
		};
	}, [currentId, handleDelete]);

	if (!currentOutline) {
		return null;
	}

	return (
		<>
			<DetailPage
				md={md}
				setMd={(updated: string) => {
					setMd(updated);
					if (currentId) {
						const next = outlines.map((o) =>
							o.id === currentId ? { ...o, md: updated } : o,
						);
						persist(next);
					}
				}}
				onBack={() => {
					setOpenFull(false);
					navigate("/teaching/syllabus/ListPage");
				}}
				openFull={openFull}
				setOpenFull={setOpenFull}
				title={currentOutline?.title}
				id={currentOutline?.id}
				onRename={(id, newName) => {
					if (!newName) return;
					const next = outlines.map((o) =>
						o.id === id ? { ...o, title: newName } : o,
					);
					persist(next);
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
