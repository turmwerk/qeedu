import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DetailPage from "./DetailPage";
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

const DetailRoute: React.FC = () => {
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

  const stateId = (location.state as { id?: string } | null)?.id;
  const fallbackId = useMemo(() => {
    if (stateId) return stateId;
    try {
      const savedId = localStorage.getItem(CURRENT_KEY);
      if (savedId) return savedId;
    } catch (e) {
      console.warn("read current exam id failed", e);
    }
    return exams[0]?.id || null;
  }, [exams, stateId]);

  const currentId = manualId || fallbackId;

  useEffect(() => {
    if (!currentId && exams.length === 0) {
      navigate("/teaching/exam/ListPage");
    }
  }, [currentId, exams.length, navigate]);

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

  const current = useMemo(
    () => exams.find((e) => e.id === currentId),
    [exams, currentId]
  );

  useEffect(() => {
    if (currentId && !current) {
      navigate("/teaching/exam/ListPage");
    }
  }, [current, currentId, navigate]);

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

  useEffect(() => {
    const onSelect = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id) setManualId(detail.id);
    };
    const onDelete = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (detail?.id) handleDelete(detail.id);
    };
    const onCreate = () => {
      navigate("/teaching/exam/ListPage", { state: { openCreate: true } });
    };
    window.addEventListener("exam-exam-select", onSelect as EventListener);
    window.addEventListener("exam-exam-delete", onDelete as EventListener);
    window.addEventListener("exam-exam-create", onCreate);
    return () => {
      window.removeEventListener("exam-exam-select", onSelect as EventListener);
      window.removeEventListener("exam-exam-delete", onDelete as EventListener);
      window.removeEventListener("exam-exam-create", onCreate);
    };
  }, [handleDelete, navigate]);

  if (!current) {
    return null;
  }

  return (
    <DetailPage
      key={current?.id || "default-exam"}
      examId={current?.id}
      title={current?.title}
      questions={current?.questions}
      onBack={() => {
        navigate("/teaching/exam/ListPage");
      }}
    />
  );
};

export default DetailRoute;
