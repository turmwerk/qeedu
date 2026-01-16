import React from 'react';
import { ExperimentOutlined, FormOutlined, BookOutlined } from '@ant-design/icons';
import ModuleHub from '@/pages/shared/ModuleHub';

const TeachingHub: React.FC = () => {
  return (
    <ModuleHub
      title="南京大学 · 助教模块"
      icon={<ExperimentOutlined />}
      headline="助教模块可以帮你更高效备课与出题"
      subtitle="试卷设计 · 大纲生成 · 作业批改"
      placeholder="你想怎么用助教？例如：生成一份算法期末试卷"
      features={[
        {
          key: 'exam-design',
          title: '试卷设计',
          desc: '快速搭建题型组合并输出大题。',
          to: '/teaching/exam',
          icon: <FormOutlined />,
        },
        {
          key: 'syllabus',
          title: '大纲生成',
          desc: '匹配教学目标与考核内容。',
          to: '/teaching/syllabus',
          icon: <BookOutlined />,
        },
      ]}
    />
  );
};

export default TeachingHub;
