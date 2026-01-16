import React from 'react';
import shared from '@/pages/shared/style.module.scss';
import styles from './style.module.scss';

const MajorConstruct: React.FC = () => {
  return (
    <div>
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
