import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import styles from '../style.module.scss';
import shared from '@/pages/shared/style.module.scss';
import List from '@/components/List';
import listStyles from '@/components/List/style.module.scss';
import Form from '@/components/Form';
import Model from '@/components/Model';
import ConfirmDialog from '@/components/ConfirmDialog';

type ExamItem = {
  id: string;
  title: string;
  subtitle?: string;
  createdAt?: number;
};

const ListPage: React.FC<{
  items: ExamItem[];
  onEdit: (id?: string) => void;
  onCreate: (payload: any) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}> = ({ items, onEdit, onCreate, onDelete, onRename }) => {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string>('');
  // DifficultyPicker with two draggable knobs controlling boundaries between easy|medium|hard
  const DifficultyPicker: React.FC<{ value: any; onChange: (v: any) => void }> = ({ value, onChange }) => {
    const init = value || { easy: 30, medium: 50, hard: 20 };
    // positions: p1 = easy%, p2 = easy+medium%
    const [p1, setP1] = useState<number>(init.easy);
    const [p2, setP2] = useState<number>(init.easy + init.medium);
    const barRef = React.useRef<HTMLDivElement | null>(null);
    const dragging = React.useRef<'p1' | 'p2' | null>(null);

    React.useEffect(() => {
      // sync when external value changes
      const v = value || { easy: 30, medium: 50, hard: 20 };
      setP1(v.easy);
      setP2(v.easy + v.medium);
    }, [value]);

    const clamp = (n: number, a = 0, b = 100) => Math.max(a, Math.min(b, n));

    const updateFromPositions = (np1: number, np2: number) => {
      const easy = Math.round(clamp(np1, 0, np2));
      const medium = Math.round(clamp(np2 - np1, 0, 100 - easy));
      const hard = 100 - easy - medium;
      onChange({ easy, medium, hard });
    };

    const onMove = (clientX: number) => {
      const bar = barRef.current;
      if (!bar || !dragging.current) return;
      const rect = bar.getBoundingClientRect();
      const rel = ((clientX - rect.left) / rect.width) * 100;
      if (dragging.current === 'p1') {
        const np1 = clamp(rel, 0, p2 - 1);
        setP1(np1);
        updateFromPositions(np1, p2);
      } else if (dragging.current === 'p2') {
        const np2 = clamp(rel, p1 + 1, 100);
        setP2(np2);
        updateFromPositions(p1, np2);
      }
    };

    React.useEffect(() => {
      const onMouseMove = (e: MouseEvent) => onMove(e.clientX);
      const onTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientX);
      const stop = () => { dragging.current = null; };
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('mouseup', stop);
      window.addEventListener('touchend', stop);
      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('mouseup', stop);
        window.removeEventListener('touchend', stop);
      };
    }, [p1, p2]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ padding: '6px 12px', borderRadius: 8, background: '#fbf7ff' }}>
          <div ref={barRef} style={{ height: 12, background: '#f0e7ff', borderRadius: 8, position: 'relative' }}>
            {/* easy segment */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${p1}%`, background: '#6b2fb1', borderRadius: 8 }} />
            {/* medium segment */}
            <div style={{ position: 'absolute', left: `${p1}%`, top: 0, bottom: 0, width: `${p2 - p1}%`, background: '#b080ff' }} />
            {/* hard segment */}
            <div style={{ position: 'absolute', left: `${p2}%`, top: 0, bottom: 0, right: 0, background: '#e9ddff', borderRadius: 8 }} />

            {/* knobs */}
            <div
              role="slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(p1)}
              onMouseDown={(e) => { e.preventDefault(); dragging.current = 'p1'; }}
              onTouchStart={() => { dragging.current = 'p1'; }}
              style={{ position: 'absolute', top: '50%', transform: 'translate(-50%,-50%)', left: `${p1}%`, width: 18, height: 18, borderRadius: 9, background: '#fff', border: '4px solid #6b2fb1', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', cursor: 'grab' }}
            />
            <div
              role="slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(p2)}
              onMouseDown={(e) => { e.preventDefault(); dragging.current = 'p2'; }}
              onTouchStart={() => { dragging.current = 'p2'; }}
              style={{ position: 'absolute', top: '50%', transform: 'translate(-50%,-50%)', left: `${p2}%`, width: 18, height: 18, borderRadius: 9, background: '#fff', border: '4px solid #6b2fb1', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', cursor: 'grab' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <label style={{ minWidth: 60 }}>简单</label>
          <input type="number" value={Math.round(p1)} onChange={e => {
            const val = Number(e.target.value || 0);
            const np1 = clamp(val, 0, p2 - 1);
            setP1(np1);
            updateFromPositions(np1, p2);
          }} style={{ width: 72 }} />
          <label style={{ minWidth: 60 }}>中等</label>
          <input type="number" value={Math.round(p2 - p1)} onChange={e => {
            const val = Number(e.target.value || 0);
            const np2 = clamp(p1 + val, p1 + 1, 100);
            setP2(np2);
            updateFromPositions(p1, np2);
          }} style={{ width: 72 }} />
          <label style={{ minWidth: 60 }}>困难</label>
          <input type="number" value={Math.round(100 - p2)} onChange={e => {
            const val = Number(e.target.value || 0);
            const np2 = clamp(100 - val, p1 + 1, 100);
            setP2(np2);
            updateFromPositions(p1, np2);
          }} style={{ width: 72 }} />
        </div>
      </div>
    );
  };
  return (
    <div>
      <PageHeader title="试卷设计" />
      <div className={shared.content}>
        <div className={styles.layout}>
          <div className={styles.leftPane}>
            <div className={styles.canvasCard}>
              <div className={styles.canvasHeader}>
                <div className="titleLeft">已创建的试卷 ({items.length})</div>
                <div>
                  <button className={styles.editBtn} onClick={() => setOpen(true)}>新建试卷</button>
                </div>
              </div>
              <div style={{ padding: 12 }}>
                <List
                  items={items}
                  keyExtractor={(i: any) => i.id}
                  editable={{ getValue: (i: any) => i.title }}
                  renderItem={(item: any) => <>
                    <div className={styles.title}>{item.title}</div>
                    <div className={styles.meta}>
                      {item.subtitle && <span className={styles.subtitle}>{item.subtitle}</span>}
                      {item.createdAt && <span className={styles.time}>{new Date(item.createdAt).toLocaleString()}</span>}
                    </div>
                  </>}
                  actions={[
                    { label: '继续编辑', onClick: (item: any) => onEdit(item.id), className: listStyles.btnEdit },
                    { label: '重命名', isRename: true, onClick: (item: any, newName?: string) => newName && onRename(item.id, newName), className: listStyles.btnRename },
                    {
                      label: '删除',
                      onClick: (item: any) => {
                        setConfirmDeleteId(item.id);
                        setConfirmDeleteTitle(item.title || '未命名试卷');
                      },
                      className: listStyles.btnDanger,
                    }
                  ]}
                  emptyText="暂无试卷。"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Model visible={open} title="新建试卷" onClose={() => setOpen(false)}>
        <div>
          <p style={{ color: '#666' }}>填写试卷基本信息以便快速生成试卷初稿。</p>
          <div style={{ marginTop: 12 }}>
              <Form
                fields={[
                { name: 'name', label: '试卷标题', placeholder: '例如： 期末考试 2025', defaultValue: '未命名试卷' },
                { name: 'content', label: '考察内容', type: 'textarea', placeholder: '例如： 操作系统、数据库', rows: 6 },
                { name: 'materials', label: '相关资料', type: 'file', multiple: true, accept: '.pdf,.docx,.pptx' },
                { name: 'difficulty', label: '难度预设比例', defaultValue: { easy: 30, medium: 50, hard: 20 }, render: (value, onChange) => <DifficultyPicker value={value} onChange={onChange} /> },
                { name: 'choose_count', label: '选择', type: 'number', defaultValue: 10 },
                { name: 'short_count', label: '简答', type: 'number', defaultValue: 4 },
                { name: 'fill_count', label: '填空', type: 'number', defaultValue: 0 },
                { name: 'program_count', label: '编程', type: 'number', defaultValue: 0 },
                { name: 'essay_count', label: '论述', type: 'number', defaultValue: 0 }
                ]}
                submitText="生成初稿"
                submitLoading={isCreating}
                submitLoadingText="生成中"
                submitDisabled={isCreating}
                onSubmit={(values) => {
                  if (isCreating) return;
                  setIsCreating(true);
                  setTimeout(() => {
                    onCreate(values);
                    setOpen(false);
                    setIsCreating(false);
                  }, 600);
                }}
              />
          </div>
        </div>
      </Model>

      <ConfirmDialog
        open={!!confirmDeleteId}
        title="删除试卷"
        description={`确认删除「${confirmDeleteTitle}」吗？此操作不可恢复。`}
        confirmText="确认删除"
        danger
        onCancel={() => {
          setConfirmDeleteId(null);
          setConfirmDeleteTitle('');
        }}
        onConfirm={() => {
          if (confirmDeleteId) onDelete(confirmDeleteId);
          setConfirmDeleteId(null);
          setConfirmDeleteTitle('');
        }}
      />
    </div>
  );
};

export default ListPage;
