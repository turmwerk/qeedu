import React from 'react';
import PageHeader from '@/components/PageHeader';
import styles from '../style.module.scss';
import shared from '@/pages/shared/style.module.scss';
import List from '@/components/List';
import Form from '@/components/Form';

const ListPage: React.FC<{ onEdit: () => void }> = ({ onEdit }) => {
  return (
    <div>
      <PageHeader title="大纲设计" />
      <div className={shared.content}>
        <div className={styles.layout}>
          <div className={styles.leftPane}>
            <div className={styles.canvasCard}>
              <div className={styles.canvasHeader}>
                <div className="titleLeft">已创建的大纲</div>
              </div>
              <div style={{ padding: 12 }}>
                <List
                  items={[{ id: 'demo', title: '示例： 现代操作系统', subtitle: '示例' }]}
                  renderItem={item => <>
                    <div className={styles.title}>{item.title}</div>
                    {item.subtitle && <div className={styles.subtitle}>{item.subtitle}</div>}
                  </>}
                  actions={[
                    { label: '继续编辑', onClick: () => onEdit() },
                    { label: '重命名', onClick: item => console.log('rename', item.id) },
                    { label: '删除', onClick: item => console.log('delete', item.id), className: styles.btnDanger }
                  ]}
                  emptyText="暂无课程大纲。"
                />
              </div>
            </div>
          </div>
          <div className={styles.rightPane}>
            <div className={styles.aiCard}>
              <h3>新建课程大纲</h3>
              <p style={{ color: '#666' }}>简要表单保证必填槽位，然后进入双栏协作。</p>
              <div style={{ marginTop: 12 }}>
                <Form
                  fields={[
                    { name: 'name', label: '课程名称', placeholder: '例如： 现代操作系统' },
                    { name: 'goals', label: '教学目标', type: 'textarea', placeholder: '例如： 掌握虚拟化与容器技术' },
                    { name: 'weeks', label: '周数 / 学时', type: 'number', defaultValue: 16 }
                  ]}
                  submitText="生成初稿"
                  onSubmit={() => onEdit()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPage;
