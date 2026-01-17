import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './components/Header';

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 首次访问站点时引导至登录（仅一次，保存在 localStorage）
    try {
      const visited = localStorage.getItem('site-has-visited');
      if (!visited) {
        localStorage.setItem('site-has-visited', '1');
        navigate('/login');
      }
    } catch (e) {
      // ignore
    }
  }, [navigate]);
  return (
    <Layout className="min-h-screen">
      <Header />
      <Content className="m-0">
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainLayout;
