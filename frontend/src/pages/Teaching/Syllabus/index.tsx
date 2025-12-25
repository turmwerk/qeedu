import React, { useState } from 'react';
import ListPage from './ListPage';
import DetailPage from './DetailPage';

const Syllabus: React.FC = () => {
  const exampleMd = `# 课程大纲\n\n## 课程目标\n\n简要描述课程目标。\n\n## 按周计划\n\n- 第1周：课程导论与学习地图\n- 第2周：核心概念与术语框架\n- 第3周：关键方法与工具链\n`;
  const [md, setMd] = useState(exampleMd);
  const [openFull, setOpenFull] = useState(false);
  const [view, setView] = useState<'list' | 'edit'>('list');

  if (view === 'edit') {
    return (
      <DetailPage
        md={md}
        setMd={setMd}
        onBack={() => {
          setOpenFull(false);
          setView('list');
        }}
        openFull={openFull}
        setOpenFull={setOpenFull}
      />
    );
  }
  return <ListPage onEdit={() => setView('edit')} />;
};

export default Syllabus;
