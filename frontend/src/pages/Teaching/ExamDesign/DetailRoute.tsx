import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DetailPage from "./DetailPage";

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
  const [exams, setExams] = useState<Exam[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setExams(JSON.parse(raw));
      else setExams([]);
    } catch (e) {
      console.error("load exams", e);
      setExams([]);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (currentId) return;
    const stateId = (location.state as { id?: string } | null)?.id;
    if (stateId) {
      setCurrentId(stateId);
      return;
    }
    try {
      const savedId = localStorage.getItem(CURRENT_KEY);
      if (savedId) {
        setCurrentId(savedId);
        return;
      }
    } catch {}
    if (exams[0]) {
      setCurrentId(exams[0].id);
      return;
    }
    if (loaded && exams.length === 0) {
      navigate("/teaching/exam/ListPage");
    }
  }, [currentId, exams, location.state, navigate, loaded]);

  useEffect(() => {
    if (!currentId) return;
    try {
      localStorage.setItem(CURRENT_KEY, currentId);
    } catch {}
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

  if (!current) {
    return null;
  }

  return (
    <DetailPage
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
