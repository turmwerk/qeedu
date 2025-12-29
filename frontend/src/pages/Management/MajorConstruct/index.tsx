import React from 'react';
import PageHeader from '@/components/PageHeader';
import shared from '@/pages/shared/style.module.scss';
import styles from './style.module.scss';

const MajorConstruct: React.FC = () => {
  return (
    <div>
      <PageHeader title="专业建设" />
      <div className={shared.content}>
        <div className={styles.container}>
          <h2 className={styles.title}>Major Construct</h2>
          <p className={styles.desc}>占位。</p>
        </div>
      </div>
    </div>
  );
};

export default MajorConstruct;
