import React from 'react';
import PageHeader from '@/components/PageHeader';
import shared from '@/pages/shared/style.module.scss';
import styles from './style.module.scss';

const Collaboration: React.FC = () => {
  return (
    <div>
      <PageHeader title="科研协作" />
      <div className={shared.content}>
        <div className={styles.container}>
          <h2 className={styles.title}>Collaboration</h2>
          <p className={styles.desc}>。。</p>
        </div>
      </div>
    </div>
  );
};

export default Collaboration;
