import React from 'react';
import PageHeader from '@/components/PageHeader';
import shared from '@/pages/shared/style.module.scss';
import styles from './style.module.scss';

const ExamDesign: React.FC = () => {
  return (
    <div>
      <PageHeader title="试题设计" />
      <div className={shared.content}>
        <div className={styles.container}>
          <h2 className={styles.title}>Exam Design</h2>
          <p className={styles.desc}>占位：试题与考试设计页面。</p>
        </div>
      </div>
    </div>
  );
};

export default ExamDesign;
