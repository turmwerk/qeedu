import React, { useEffect, useState } from 'react';
import ListPage from './ListPage';
import DetailPage from './DetailPage';
import Dialog from '@/components/Dialog';

type Outline = {
  id: string;
  title: string;
  subtitle?: string;
  md: string;
  createdAt?: number;
};

const STORAGE_KEY = 'syllabus_outlines';

const Syllabus: React.FC = () => {
  const exampleMd = `# 课程大纲\n\n## 课程目标\n\n简要描述课程目标。\n\n## 按周计划\n\n- 第1周：课程导论与学习地图\n- 第2周：核心概念与术语框架\n- 第3周：关键方法与工具链\n`;
  const [md, setMd] = useState(exampleMd);
  const [openFull, setOpenFull] = useState(false);
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [outlines, setOutlines] = useState<Outline[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setOutlines(JSON.parse(raw));
    } catch (e) {
      console.error('load outlines', e);
    }
  }, []);

  const persist = (next: Outline[]) => {
    setOutlines(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('save outlines', e);
    }
  };

  const handleCreate = (payload: Record<string, any>) => {
    const id = Date.now().toString();
    const name = payload.name || '未命名课程';
    const subject = payload.subject || '';
    const level = payload.level || '';
    const prereq = payload.prereq || '';
    const goals = payload.goals || '';
    const weeks = payload.weeks || '';
    const ratio = payload.ratio || '';
    const notes = payload.notes || '';
    const materials = payload.materials ? (payload.materials.name || '') : '';

    const mdText = `# ${name}\n\n**学科**：${subject}\n\n**学生层级**：${level}\n\n**先修背景**：${prereq}\n\n## 教学目标\n\n${goals}\n\n## 周数 / 学时\n\n- ${weeks}\n\n## 理论 / 实践 比例\n\n- ${ratio}\n\n## 备注\n\n${notes}\n\n## 课程资料\n\n${materials ? `- 附件：${materials}` : '- 无附件'}`;

    const item: Outline = { id, title: name, subtitle: subject || '', md: mdText, createdAt: Date.now() };
    const next = [item, ...outlines];
    persist(next);
    setMd(mdText);
    setCurrentId(id);
    setView('edit');
  };

  const handleDelete = (id: string) => {
    const next = outlines.filter(o => o.id !== id);
    persist(next);
    // 清理对应大纲的Dialog对话数据
    Dialog.clearDialog(id);
    if (view === 'edit') setView('list');
    if (currentId === id) setCurrentId(null);
  };

  const handleEdit = (id: string) => {
    const found = outlines.find(o => o.id === id);
    if (found) {
      setMd(found.md);
      setCurrentId(id);
      setView('edit');
    }
  };

  const handleRename = (id: string, newName?: string) => {
    if (!newName) return;
    const found = outlines.find(o => o.id === id);
    if (!found) return;
    if (newName && newName !== found.title) {
      const next = outlines.map(o => (o.id === id ? { ...o, title: newName } : o));
      persist(next);
    }
  };

  if (view === 'edit') {
    const currentOutline = outlines.find(o => o.id === currentId);
    return (
      <DetailPage
        md={md}
        setMd={(updated: string) => {
          setMd(updated);
          if (currentId) {
            const next = outlines.map(o => (o.id === currentId ? { ...o, md: updated } : o));
            persist(next);
          }
        }}
        onBack={() => {
          setOpenFull(false);
          setView('list');
        }}
        openFull={openFull}
        setOpenFull={setOpenFull}
        title={currentOutline?.title}
        id={currentOutline?.id}
        onRename={(id, newName) => handleRename(id, newName)}
      />
    );
  }
  return (
    <ListPage
      items={outlines}
      onEdit={(id?: string) => {
        if (id) handleEdit(id);
        else setView('edit');
      }}
      onCreate={handleCreate}
      onDelete={(id?: string) => id && handleDelete(id)}
      onRename={(id?: string, newName?: string) => id && handleRename(id, newName)}
    />
  );
};

export default Syllabus;
