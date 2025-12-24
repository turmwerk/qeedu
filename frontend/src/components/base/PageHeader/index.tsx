import React from 'react';
import styles from './style.module.scss';

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
};

const PageHeader: React.FC<Props> = ({ title }) => {
  return (
    <div className={styles.titleWrap}>
      <h1 className={styles.pageTitle}>{title}</h1>
    </div>
  );
};

export default PageHeader;
