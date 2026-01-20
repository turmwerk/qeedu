import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListPage from "./ListPage";
import Dialog from "@/components/Dialog";

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

const ListRoute: React.FC = () => {
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

  const handleCreate = useCallback(
    (payload: Record<string, unknown>) => {
      const id = Date.now().toString();
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
      navigate("/teaching/exam/DetailPage");
    },
    [exams, navigate, persist, setCurrentId]
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
      navigate("/teaching/exam/DetailPage", { state: { id: nextId } });
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

export default ListRoute;
