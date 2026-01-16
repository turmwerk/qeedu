import React from 'react';
import { TeamOutlined } from '@ant-design/icons';
import ModuleHub from '@/pages/shared/ModuleHub';

const ResearchHub: React.FC = () => {
  return (
    <ModuleHub
      title="南京大学 · 助研模块"
      icon={<TeamOutlined />}
      headline="助研模块可以帮你更高效推进科研协作"
      subtitle="课题协作 · 文献整理 · 进度跟踪"
      placeholder="你想怎么用助研？例如：协作安排 / 资料归档"
      features={[
        {
          key: 'collaboration',
          title: '科研协作',
          desc: '协同沟通、任务对齐、材料归档。',
          to: '/research/collaboration',
          icon: <TeamOutlined />,
        },
      ]}
    />
  );
};

export default ResearchHub;
