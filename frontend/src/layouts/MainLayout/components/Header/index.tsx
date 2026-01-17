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
    <Header className="bg-[linear-gradient(135deg,rgba(255,255,255,0.9)_0%,rgba(250,245,255,0.85)_50%,rgba(240,248,255,0.9)_100%)] backdrop-blur-[20px] shadow-[0_4px_24px_rgba(98,54,255,0.08)] border-b border-[rgba(75,42,133,0.08)] py-2 px-10 flex items-center justify-between relative z-[100]">
      <div className="flex items-center gap-3">
        {currentConfig.icon && <span className="text-[24px] text-[#6236ff] flex items-center">{currentConfig.icon}</span>}
        <h1 className="m-0 text-[20px] font-bold text-[#1a1a1a]">{currentConfig.title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {!isHomePage && (
          <button 
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-[#1a1a1a] bg-transparent border-0 cursor-pointer rounded-lg transition-all hover:text-[#6236ff] hover:bg-[rgba(98,54,255,0.05)]"
            onClick={() => navigate('/')}
          >
            <HomeOutlined />
            <span>首页</span>
          </button>
        )}
        {isHomePage ? (
          <button 
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-[#1a1a1a] bg-transparent border-0 cursor-pointer rounded-lg transition-all hover:text-[#6236ff] hover:bg-[rgba(98,54,255,0.05)]"
            onClick={() => navigate('/login')}
          >
            <UserOutlined />
            <span>登录 / 注册</span>
          </button>
        ) : (
          <button 
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-[#1a1a1a] bg-transparent border-0 cursor-pointer rounded-lg transition-all hover:text-[#6236ff] hover:bg-[rgba(98,54,255,0.05)]"
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
