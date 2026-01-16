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
  NotificationOutlined 
} from '@ant-design/icons';
import PageHeader from '@/components/PageHeader';
import styles from './style.module.scss';

const { Header } = Layout;

// 路由配置：根据路由路径返回对应的标题和icon
const routeConfig: Record<string, { title: string; icon?: React.ReactNode }> = {
  '/': { title: 'nju-edu-ai-system' },
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
      <div className={styles.brandArea}>
        <h1 className={styles.mainTitle}>nju-edu-ai-system</h1>
        <p className={styles.subTitle}>南京大学教育大模型</p>
      </div>
      
      {!isHomePage && (
        <div className={styles.pageHeaderWrapper}>
          <PageHeader 
            title={currentConfig.title}
            icon={currentConfig.icon}
          >
            <button 
              className={styles.backBtn}
              onClick={() => navigate(-1)}
            >
              返回
            </button>
          </PageHeader>
        </div>
      )}
      
      {isHomePage && (
        <div className={styles.actionArea}>
          <button 
            className={styles.loginBtn}
            onClick={() => navigate('/login')}
          >
            登录 / 注册
          </button>
        </div>
      )}
    </Header>
  );
};

export default MainHeader;
