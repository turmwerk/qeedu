import React from 'react';
import PageHeader from '@/components/PageHeader';
import shared from '@/pages/shared/style.module.scss';
import styles from './style.module.scss';

const CodeTutor: React.FC = () => {
  return (
    <div>
      <PageHeader title="编程辅导" />
      <div className={shared.content}>
        <div className={styles.container}>
          <h2 className={styles.title}>Code Tutor</h2>
          <p className={styles.desc}>先占位。</p>
        </div>
      </div>
    </div>
  );
};

export default CodeTutor;
