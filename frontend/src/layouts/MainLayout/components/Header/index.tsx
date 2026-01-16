import React from 'react';
import { Layout } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ReadOutlined, 
  ExperimentOutlined, 
  TeamOutlined, 
  ControlOutlined,
  CodeOutlined,
  BookOutlined,
  FormOutlined,
  BuildOutlined,
  NotificationOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  UserOutlined
} from '@ant-design/icons';
import PageHeader from '@/components/PageHeader';
import styles from './style.module.scss';

const { Header } = Layout;

// 路由配置：根据路由路径返回对应的标题和icon
const routeConfig: Record<string, { title: string; icon?: React.ReactNode }> = {
  '/': { title: '南京大学 · 智能教学', icon: <HomeOutlined /> },
  '/study': { title: '南京大学 · 助学模块', icon: <ReadOutlined /> },
  '/study/code-tutor': { title: '编程辅导', icon: <CodeOutlined /> },
  '/teaching': { title: '南京大学 · 助教模块', icon: <ExperimentOutlined /> },
  '/teaching/syllabus': { title: '大纲设计', icon: <BookOutlined /> },
  '/teaching/exam': { title: '试卷设计', icon: <FormOutlined /> },
  '/research': { title: '南京大学 · 助研模块', icon: <TeamOutlined /> },
  '/research/collaboration': { title: '科研协作', icon: <TeamOutlined /> },
  '/management': { title: '南京大学 · 助管模块', icon: <ControlOutlined /> },
  '/management/major': { title: '专业建设', icon: <BuildOutlined /> },
  '/management/policy': { title: '政策响应', icon: <NotificationOutlined /> },
};

const MainHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // 获取当前路由的配置
  const currentConfig = routeConfig[location.pathname] || { title: 'nju-edu-ai-system' };

  return (
    <Header className={styles.header}>
      <div className={styles.leftArea}>
        {currentConfig.icon && <span className={styles.titleIcon}>{currentConfig.icon}</span>}
        <h1 className={styles.title}>{currentConfig.title}</h1>
      </div>
      <div className={styles.rightArea}>
        {!isHomePage && (
          <button 
            className={styles.iconBtn}
            onClick={() => navigate('/')}
          >
            <HomeOutlined />
            <span>首页</span>
          </button>
        )}
        {isHomePage ? (
          <button 
            className={styles.iconBtn}
            onClick={() => navigate('/login')}
          >
            <UserOutlined />
            <span>登录 / 注册</span>
          </button>
        ) : (
          <button 
            className={styles.iconBtn}
            onClick={() => navigate(-1)}
          >
            <ArrowLeftOutlined />
            <span>返回</span>
          </button>
        )}
      </div>
    </Header>
  );
};

export default MainHeader;
