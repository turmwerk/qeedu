import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import styles from '../style.module.scss';
import shared from '@/pages/shared/style.module.scss';
import List from '@/components/List';
import listStyles from '@/components/List/style.module.scss';
import Form from '@/components/Form';
import Model from '@/components/Model';
import ConfirmDialog from '@/components/ConfirmDialog';

type Outline = {
  id: string;
  title: string;
  subtitle?: string;
  md: string;
  createdAt?: number;
};

const ListPage: React.FC<{
  items: Outline[];
  onEdit: (id?: string) => void;
  onCreate: (payload: { name: string; goals: string; weeks: number }) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}> = ({ items, onEdit, onCreate, onDelete, onRename }) => {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string>('');
  return (
    <div>
      <PageHeader title="大纲设计" />
      <div className={shared.content}>
        <div className={styles.layout}>
          <div className={styles.leftPane}>
            <div className={styles.canvasCard}>
              <div className={styles.canvasHeader}>
                <div className="titleLeft">已创建的大纲 ({items.length})</div>
                <div>
                  <button className={styles.editBtn} onClick={() => setOpen(true)}>新建大纲</button>
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
                        setConfirmDeleteTitle(item.title || '未命名课程');
                      },
                      className: listStyles.btnDanger,
                    }
                  ]}
                  emptyText="暂无课程大纲。"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Model visible={open} title="新建课程大纲" onClose={() => setOpen(false)}>
        <div>
          <p style={{ color: '#666' }}>简要表单保证必填槽位，然后进入双栏协作。</p>
          <div style={{ marginTop: 12 }}>
            <Form
              fields={[
                { name: 'name', label: '课程名称', placeholder: '例如： 现代操作系统' },
                { name: 'subject', label: '学科', placeholder: '例如： 计算机科学与技术' },
                { name: 'level', label: '学生层级', type: 'select', options: [
                  { label: '请选择', value: '' },
                  { label: '大一大二基础课', value: 'freshman' },
                  { label: '高年级', value: 'senior' },
                  { label: '研究生', value: 'postgrad' },
                  { label: '其他', value: 'other' }
                ] },
                { name: 'prereq', label: '先修背景', placeholder: '例如： C 语言基础、数据结构' },
                { name: 'goals', label: '教学目标', type: 'textarea', placeholder: '例如： 掌握虚拟化与容器技术' },
                { name: 'weeks', label: '周数 / 学时', type: 'number', defaultValue: 16 },
                { name: 'ratio', label: '理论 / 实践比例', placeholder: '例如： 70/30' },
                { name: 'notes', label: '备注', type: 'textarea', placeholder: '可填写课程特殊说明' },
                { name: 'materials', label: '课程资料', type: 'file' }
              ]}
              submitText="生成初稿"
              submitLoading={isCreating}
              submitLoadingText="生成中"
              submitDisabled={isCreating}
              onSubmit={(values) => {
                if (isCreating) return;
                setIsCreating(true);
                setTimeout(() => {
                  onCreate(values as any);
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
        title="删除课程大纲"
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
