import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReadOutlined, ExperimentOutlined, ControlOutlined, TeamOutlined } from '@ant-design/icons';
import shared from '@/pages/shared/style.module.scss';
import styles from './style.module.scss';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const modules = [
    {
      key: 'study',
      title: '助学',
      desc: '自学导航、练习计划、随问随答。',
      to: '/study',
      icon: <ReadOutlined />,
    },
    {
      key: 'teaching',
      title: '助教',
      desc: '试卷生成、大纲设计、作业批改与反馈。',
      to: '/teaching',
      icon: <ExperimentOutlined />,
    },
    {
      key: 'research',
      title: '助研',
      desc: '科研协作、资料整理、进度跟踪。',
      to: '/research',
      icon: <TeamOutlined />,
    },
    {
      key: 'management',
      title: '助管',
      desc: '班级管理、通知发布、资料归档与跟进。',
      to: '/management',
      icon: <ControlOutlined />,
    },
  ];

  return (
    <div className={styles.homePage}>
      <div className={shared.content}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>nju-edu-ai-system</h1>
          <div className={styles.heroSubtitle}>南京大学教育大模型</div>
          <div className={styles.prompt}>
            <span className={styles.promptIcon} aria-hidden="true">≡</span>
            <input
              className={styles.promptInput}
              placeholder="告诉我你想完成的任务（如：试卷设计流程 / 某功能怎么用）"
              type="text"
              aria-label="任务输入"
            />
            <button type="button" className={styles.sendBtn} aria-label="发送">
              →
            </button>
          </div>
          <div className={styles.cardGrid}>
            {modules.map((item) => (
              <button
                key={item.key}
                type="button"
                className={styles.card}
                onClick={() => navigate(item.to)}
              >
                {item.icon && <span className={styles.cardIcon}>{item.icon}</span>}
                <div className={styles.cardContent}>
                  <div className={styles.cardTitle}>{item.title}</div>
                  <div className={styles.cardDesc}>{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
