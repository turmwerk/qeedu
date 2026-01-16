import React from 'react';
import { ReadOutlined, CodeOutlined } from '@ant-design/icons';
import ModuleHub from '@/pages/shared/ModuleHub';

const StudyHub: React.FC = () => {
  return (
    <ModuleHub
      title="南京大学 · 助学模块"
      icon={<ReadOutlined />}
      headline="助学模块可以帮你更高效学习与答疑"
      subtitle="自学导航 · 练习计划 · 随问随答"
      placeholder="你想怎么用助学？例如：编程辅导 / 学习计划"
      features={[
        {
          key: 'code-tutor',
          title: '编程辅导',
          desc: '代码答疑、错误定位与讲解。',
          to: '/study/code-tutor',
          icon: <CodeOutlined />,
        },
      ]}
    />
  );
};

export default StudyHub;
