import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import styles from '../style.module.scss';
import shared from '@/pages/shared/style.module.scss';
import List from '@/components/List';
import listStyles from '@/components/List/style.module.scss';
import Form from '@/components/Form';
import Model from '@/components/Model';

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
                    { label: '删除', onClick: (item: any) => onDelete(item.id), className: listStyles.btnDanger }
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
                { name: 'name', label: '试卷标题', placeholder: '例如： 期末考试 2025' },
                { name: 'content', label: '考察内容', type: 'textarea', placeholder: '例如： 操作系统、数据库' },
                { name: 'materials', label: '相关资料', type: 'file' },
                { name: 'difficulty', label: '难度比例（描述）', placeholder: '例如： 简单30% 中等50% 困难20%' },
                { name: 'choose_count', label: '选择题数量', type: 'number', defaultValue: 10 },
                { name: 'short_count', label: '简答题数量', type: 'number', defaultValue: 4 }
              ]}
              submitText="生成初稿"
              onSubmit={(values) => { onCreate(values); setOpen(false); }}
            />
          </div>
        </div>
      </Model>
    </div>
  );
};

export default ListPage;
