import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListPage from "./ListPage";
import Dialog from "@/components/Dialog";
import PageShell from "./PageShell";

type Outline = {
  id: string;
  title: string;
  subtitle?: string;
  md: string;
  createdAt?: number;
};

const STORAGE_KEY = "syllabus_outlines";
const CURRENT_KEY = "syllabus_current_id";

const ListRoute: React.FC = () => {
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
    window.addEventListener("syllabus-outlines-updated", onCustom as EventListener);
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

  const handleCreate = useCallback(
    (payload: Record<string, any>) => {
      const id = Date.now().toString();
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
  <tr>
    <td>备注</td>
    <td colspan="3">${payload.notes || ""}</td>
  </tr>
</table>
`;

      const item: Outline = {
        id,
        title: name,
        subtitle: unit,
        md: mdText,
        createdAt: Date.now(),
      };
      const next = [item, ...outlines];
      persist(next);
      setCurrentId(id);
      navigate("/teaching/syllabus/DetailPage");
    },
    [navigate, outlines, persist, setCurrentId]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const next = outlines.filter((o) => o.id !== id);
      persist(next);
      Dialog.clearDialog(id);
      try {
        const currentId = localStorage.getItem(CURRENT_KEY);
        if (currentId === id) {
          localStorage.removeItem(CURRENT_KEY);
        }
      } catch {}
    },
    [outlines, persist]
  );

  const handleRename = useCallback(
    (id: string, newName?: string) => {
      if (!newName) return;
      const found = outlines.find((o) => o.id === id);
      if (!found) return;
      if (newName && newName !== found.title) {
        const next = outlines.map((o) =>
          o.id === id ? { ...o, title: newName } : o,
        );
        persist(next);
      }
    },
    [outlines, persist]
  );

  const goDetail = useCallback(
    (id?: string) => {
      const nextId = id || outlines[0]?.id;
      if (!nextId) return;
      setCurrentId(nextId);
      navigate("/teaching/syllabus/DetailPage", { state: { id: nextId } });
    },
    [navigate, outlines, setCurrentId]
  );

  useEffect(() => {
    const onSelect = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id) goDetail(detail.id);
    };
    const onDelete = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id) handleDelete(detail.id);
    };
    window.addEventListener("syllabus-outline-select", onSelect as EventListener);
    window.addEventListener("syllabus-outline-delete", onDelete as EventListener);
    return () => {
      window.removeEventListener(
        "syllabus-outline-select",
        onSelect as EventListener
      );
      window.removeEventListener(
        "syllabus-outline-delete",
        onDelete as EventListener
      );
    };
  }, [goDetail, handleDelete]);

  return (
    <PageShell>
      <ListPage
        items={outlines}
        onEdit={(id?: string) => goDetail(id)}
        onCreate={handleCreate}
        onDelete={(id?: string) => id && handleDelete(id)}
        onRename={(id?: string, newName?: string) =>
          id && newName && handleRename(id, newName)
        }
        openSignal={openSignal}
      />
    </PageShell>
  );
};

export default ListRoute;
