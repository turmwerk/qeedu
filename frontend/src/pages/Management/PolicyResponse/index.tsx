import React from 'react';
import PageHeader from '@/components/PageHeader';
import shared from '@/pages/shared/style.module.scss';
import styles from './style.module.scss';

const PolicyResponse: React.FC = () => {
  return (
    <div>
      <PageHeader title="政策响应" />
      <div className={shared.content}>
        <div className={styles.container}>
          <h2 className={styles.title}>Policy Response</h2>
          <p className={styles.desc}>。。</p>
        </div>
      </div>
    </div>
  );
};

export default PolicyResponse;
