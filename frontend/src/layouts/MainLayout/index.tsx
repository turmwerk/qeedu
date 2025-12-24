import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import styles from './style.module.scss';
import Sider from './components/Sider';
import Header from './components/Header';
import AssistDrawer from './components/AssistDrawer';

const { Content } = Layout;

const MainLayout: React.FC = () => {
  return (
    <Layout className={styles.root}>
      <Sider />
      <Layout>
        <Header />
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
      <AssistDrawer />
    </Layout>
  );
};

export default MainLayout;
