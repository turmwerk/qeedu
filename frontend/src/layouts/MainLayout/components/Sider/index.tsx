import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, CodeOutlined, BookOutlined, FormOutlined, BuildOutlined, NotificationOutlined, TeamOutlined } from '@ant-design/icons';
import styles from './style.module.scss';

const { Sider } = Layout;

const items = [
  { key: '/', icon: <HomeOutlined />, label: '首页' },
  { key: '/study/code-tutor', icon: <CodeOutlined />, label: '编程辅导' },
  { key: '/teaching/syllabus', icon: <BookOutlined />, label: '大纲设计' },
  { key: '/teaching/exam', icon: <FormOutlined />, label: '试题设计' },
  { key: '/management/major', icon: <BuildOutlined />, label: '专业建设' },
  { key: '/management/policy', icon: <NotificationOutlined />, label: '政策响应' },
  { key: '/research/collaboration', icon: <TeamOutlined />, label: '科研协作' },
];

const MainSider: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Sider className={styles.sider}>
      <div className={styles.logo}>NJU EDU</div>
      <Menu theme="dark" mode="inline" items={items} onClick={(e: any) => navigate(e.key)} />
    </Sider>
  );
};

export default MainSider;
