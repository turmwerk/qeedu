import React from 'react';
import { Layout } from 'antd';
import styles from './style.module.scss';

const { Header } = Layout;

const MainHeader: React.FC = () => {
  return <Header className={styles.header} />;
};

export default MainHeader;
