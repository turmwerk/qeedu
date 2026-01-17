import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, CodeOutlined, BookOutlined, FormOutlined, BuildOutlined, NotificationOutlined, TeamOutlined } from '@ant-design/icons';

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
  const location = useLocation();

  // compute selected key based on current pathname
  const pathname = location.pathname || '/';
  // choose the longest matching item.key that is a prefix of pathname
  const sortedKeys = items.map(i => i.key).sort((a, b) => b.length - a.length);
  let selectedKey = '/';
  for (const key of sortedKeys) {
    if (key === '/') {
      if (pathname === '/') {
        selectedKey = key;
        break;
      }
      continue;
    }
    if (pathname === key || pathname.startsWith(key + '/') || pathname.startsWith(key)) {
      selectedKey = key;
      break;
    }
  }

  return (
    <Sider className="shadow-[2px_0_8px_0_rgba(29,35,41,0.05)]">
      <div className="h-8 m-4 bg-[rgba(255,255,255,0.2)] text-white font-bold text-[16px] leading-8 text-center rounded-md whitespace-nowrap overflow-hidden">NJU EDU</div>
      <Menu
        theme="dark"
        mode="inline"
        items={items}
        onClick={(e: any) => navigate(e.key)}
        selectedKeys={[selectedKey]}
      />
    </Sider>
  );
};

export default MainSider;
