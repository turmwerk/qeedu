import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '@/components/Form';
import { showToast } from '@/components/Toast';
import type { FormField } from '@/components/Form';
import styles from './style.module.scss';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'reset'>('login');

  const fields: FormField[] = mode === 'login' ? [
    { name: 'account', label: '用户名或邮箱', placeholder: '用户名或邮箱' },
    { name: 'password', label: '密码', type: 'text', placeholder: '密码' },
  ] : [
    { name: 'account', label: '用户名或邮箱', placeholder: '用户名或邮箱' },
  ];

  const handleSubmit = (values: Record<string, any>) => {
    if (mode === 'login') {
      // 登录未实现
      console.log('login', values);
      showToast('登录功能未接入，使用“游客模式”进入首页');
    } else {
      // 重置邮件未实现
      console.log('reset', values);
      showToast('重置邮件发送没实现');
      setMode('login');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <button className={styles.close} onClick={() => navigate('/')}>×</button>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.active}`} onClick={() => setMode('login')}>登录</button>
          <button className={styles.tab} onClick={() => navigate('/register')}>注册</button>
        </div>

        <div className={styles.content}>
          <Form fields={fields} onSubmit={handleSubmit} submitText={mode === 'login' ? '登录' : '发送重置邮件'} submitClassName={styles.primary} />

          {mode === 'login' && (
            <div className={styles.rowBetween} style={{ marginTop: 12 }}>
              <button className={styles.link} onClick={() => setMode('reset')}>忘记密码?</button>
              <button className={styles.link} onClick={() => navigate('/')}>游客模式</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
