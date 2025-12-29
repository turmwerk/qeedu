import React from 'react';
import PageHeader from '@/components/PageHeader';
import shared from '@/pages/shared/style.module.scss';

const Home: React.FC = () => {
  return (
    <div>
      <PageHeader title="南京大学教学智能系统" />
      <div className={shared.content}>
        <p>欢迎使用南京大学教学智能系统。</p>
      </div>
    </div>
  );
};

export default Home;
