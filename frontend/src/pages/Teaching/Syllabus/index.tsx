import React from 'react';
import PageHeader from '@/components/base/PageHeader';
import shared from '@/pages/shared/style.module.scss';
import styles from './style.module.scss';

const Syllabus: React.FC = () => {
  return (
    <div>
      <PageHeader title="大纲设计" />
      <div className={shared.content}>
        <div className={styles.container}>
          <h2 className={styles.title}>Syllabus</h2>
          <p className={styles.desc}>占位：课程大纲页面。</p>
        </div>
      </div>
    </div>
  );
};

export default Syllabus;
