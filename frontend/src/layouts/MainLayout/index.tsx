import React, { useState } from 'react';
import { Layout, Menu, FloatButton, Drawer } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { GlobalOutlined, TranslationOutlined, HomeOutlined, CodeOutlined, BookOutlined, FormOutlined, BuildOutlined, NotificationOutlined, TeamOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import { Translator } from '@/features/GlobalAssist/Translator';
import { StudentGuide } from '@/features/GlobalAssist/StudentGuide';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const [assistOpen, setAssistOpen] = useState(false);
  const items = [
    { key: '/', icon: <HomeOutlined />, label: '首页' },
    { key: '/study/code-tutor', icon: <CodeOutlined />, label: '编程辅导' },
    { key: '/teaching/syllabus', icon: <BookOutlined />, label: '大纲设计' },
    { key: '/teaching/exam', icon: <FormOutlined />, label: '试题设计' },
    { key: '/management/major', icon: <BuildOutlined />, label: '专业建设' },
    { key: '/management/policy', icon: <NotificationOutlined />, label: '政策响应' },
    { key: '/research/collaboration', icon: <TeamOutlined />, label: '科研协作' },
  ];

  return (
    <Layout className={styles.root}>
      <Sider>
        <div className={styles.logo}>NJU EDU</div>
        <Menu theme='dark' mode='inline' items={items} onClick={(e) => navigate(e.key)} />
      </Sider>
      <Layout>
        <Header className={styles.header} />
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>

      {/* --- 全局留学生支持系统 (悬浮入口) --- */}
      <FloatButton.Group trigger='click' type='primary' className={styles.floatGroup} icon={<GlobalOutlined />}>
        <FloatButton icon={<TranslationOutlined />} tooltip='留学生助手' onClick={() => setAssistOpen(true)} />
      </FloatButton.Group>

      {/* --- 留学生助手抽屉 --- */}
      <Drawer title='International Support' placement='right' onClose={() => setAssistOpen(false)} open={assistOpen} width={400}>
        <h3>术语翻译</h3>
        <Translator />
        <div className={styles.spacer} />
        <h3>文化适应向导</h3>
        <StudentGuide />
      </Drawer>
    </Layout>
  );
};
export default MainLayout;
