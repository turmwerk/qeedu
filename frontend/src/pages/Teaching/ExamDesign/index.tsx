import React, { useEffect, useState } from 'react';
import ListPage from './ListPage';
import DetailPage from './DetailPage';
import Dialog from '@/components/Dialog';

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
type Exam = { id: string; title: string; questions: Question[]; createdAt?: number };

const STORAGE_KEY = 'exam_design_exams_v1';

const ExamDesign: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setExams(JSON.parse(raw));
    } catch (e) {
      console.error('load exams', e);
    }
  }, []);

  const persist = (next: Exam[]) => {
    setExams(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) { console.error(e); }
  };

  const handleCreate = (payload: Record<string, any>) => {
    const id = Date.now().toString();
    const name = payload.name || '未命名试卷';
    const item: Exam = { id, title: name, questions: [], createdAt: Date.now() };
    const next = [item, ...exams];
    persist(next);
    setCurrentId(id);
    setView('detail');
  };

  const handleDelete = (id: string) => {
    const next = exams.filter(e => e.id !== id);
    persist(next);
    // 清理 exam 及其题目的 dialog 缓存
    try {
      Dialog.clearDialog(id);
      const found = exams.find(e => e.id === id);
      if (found) {
        found.questions.forEach(q => Dialog.clearDialog(`${id}-q-${q.id}`));
      }
    } catch {}
    if (view === 'detail') setView('list');
    if (currentId === id) setCurrentId(null);
  };

  const handleEdit = (id?: string) => {
    if (!id) return;
    const found = exams.find(e => e.id === id);
    if (found) {
      setCurrentId(id);
      setView('detail');
    }
  };

  if (view === 'detail') {
    const current = exams.find(e => e.id === currentId) || exams[0] || null;
    return (
      <DetailPage
        examId={current?.id}
        title={current?.title}
        questions={current?.questions}
        onBack={() => {
          // 切回列表时重新加载 localStorage
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setExams(JSON.parse(raw));
          } catch (e) {
            console.error('load exams', e);
          }
          setView('list');
          setCurrentId(null);
        }}
      />
    );
  }

  return (
    <ListPage
      items={exams.map(e => ({ id: e.id, title: e.title, subtitle: '', createdAt: e.createdAt }))}
      onEdit={(id) => { if (id) handleEdit(id); else setView('detail'); }}
      onCreate={handleCreate}
      onDelete={(id) => { if (id) handleDelete(id); }}
      onRename={(id, newName) => {
        const next = exams.map(ex => (ex.id === id ? { ...ex, title: newName || ex.title } : ex));
        persist(next);
      }}
    />
  );
};

export default ExamDesign;
