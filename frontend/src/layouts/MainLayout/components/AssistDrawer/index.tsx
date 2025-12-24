import React, { useState } from 'react';
import { FloatButton, Drawer } from 'antd';
import { GlobalOutlined, TranslationOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import { Translator } from '@/features/GlobalAssist/Translator';
import { StudentGuide } from '@/features/GlobalAssist/StudentGuide';

const AssistDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <FloatButton.Group trigger='click' type='primary' className={styles.floatGroup} icon={<GlobalOutlined />}>
        <FloatButton icon={<TranslationOutlined />} tooltip='留学生助手' onClick={() => setOpen(true)} />
      </FloatButton.Group>

      <Drawer title='International Support' placement='right' onClose={() => setOpen(false)} open={open} width={400}>
        <h3>术语翻译</h3>
        <Translator />
        <div className={styles.spacer} />
        <h3>文化适应向导</h3>
        <StudentGuide />
      </Drawer>
    </>
  );
};

export default AssistDrawer;
