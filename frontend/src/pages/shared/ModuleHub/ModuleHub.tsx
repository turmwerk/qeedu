import React from 'react';
import { useNavigate } from 'react-router-dom';
import shared from '@/pages/shared/style.module.scss';
import styles from './ModuleHub.module.scss';

type Feature = {
  key: string;
  title: string;
  desc: string;
  to: string;
  icon?: React.ReactNode;
};

type Props = {
  headline: string;
  subtitle: string;
  placeholder: string;
  features: Feature[];
};

const ModuleHub: React.FC<Props> = ({
  headline,
  subtitle,
  placeholder,
  features,
}) => {
  const navigate = useNavigate();

  return (
    <div>

      <div className={shared.content}>
        <div className={styles.hero}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>{headline}</h1>
            <div className={styles.heroSubtitle}>{subtitle}</div>
          </div>
          <div className={styles.prompt}>
            <span className={styles.promptIcon} aria-hidden="true">≡</span>
            <input
              className={styles.promptInput}
              placeholder={placeholder}
              type="text"
              aria-label={placeholder}
            />
            <button type="button" className={styles.sendBtn} aria-label="发送">
              →
            </button>
          </div>
          <div className={styles.cardGrid}>
            {features.map((feature) => (
              <button
                key={feature.key}
                type="button"
                className={styles.card}
                onClick={() => navigate(feature.to)}
              >
                {feature.icon && <span className={styles.cardIcon}>{feature.icon}</span>}
                <div className={styles.cardContent}>
                  <div className={styles.cardTitle}>{feature.title}</div>
                  <div className={styles.cardDesc}>{feature.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleHub;
