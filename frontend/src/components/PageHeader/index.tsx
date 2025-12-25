import React from 'react';
import styles from './style.module.scss';

type Props = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
};

const PageHeader: React.FC<Props> = ({ title, subtitle, children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      <div className={styles.right}>{children}</div>
    </div>
  );
};

export default PageHeader;
