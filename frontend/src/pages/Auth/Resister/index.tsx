import { useNavigate } from 'react-router-dom';
import Form from '@/components/Form';
import { showToast } from '@/components/Toast';
import type { FormField } from '@/components/Form';
import styles from '@/pages/Auth/Login/style.module.scss';

export default function Resister() {
  const navigate = useNavigate();

  const fields: FormField[] = [
    { name: 'username', label: '用户名', placeholder: '用户名' },
    { name: 'email', label: '邮箱', placeholder: '邮箱' },
    { name: 'password', label: '密码', type: 'text', placeholder: '密码' },
  ];

  const handleSubmit = (values: Record<string, any>) => {
    console.log('register', values);
    showToast('注册未实现');

  };

  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <button className={styles.close} onClick={() => navigate('/')}>×</button>
        <div className={styles.tabs}>
          <button className={styles.tab} onClick={() => navigate('/login')}>登录</button>
          <button className={`${styles.tab} ${styles.active}`}>注册</button>
        </div>
        <div className={styles.content}>
          <Form fields={fields} onSubmit={handleSubmit} submitText="注册" submitClassName={styles.primary} />
        </div>
      </div>
    </div>
  );
}
