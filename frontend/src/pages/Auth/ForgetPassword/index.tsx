import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '@/components/Form';
import { showToast } from '@/components/Toast';
import type { FormField } from '@/components/Form';
import styles from './style.module.scss';

function EyeIcon({ on }: { on: boolean }) {
  return (
    <svg
      className={styles.eyeIcon}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {on ? (
        <>
          <path
            d="M2.2 12c1.9-4.7 5.4-7.5 9.8-7.5S19.9 7.3 21.8 12c-1.9 4.7-5.4 7.5-9.8 7.5S4.1 16.7 2.2 12Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </>
      ) : (
        <>
          <path
            d="M3 12c2.1-4.7 5.6-7.5 9-7.5 3.4 0 6.9 2.8 9 7.5-2.1 4.7-5.6 7.5-9 7.5-3.4 0-6.9-2.8-9-7.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M4 4l16 16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const fields: FormField[] = [
    { name: 'email', label: '邮箱', placeholder: '邮箱' },
    {
      name: 'emailCode',
      label: '邮箱验证码',
      placeholder: '邮箱验证码',
      render: (value, onChange) => (
        <div className={styles.codeWrap}>
          <input
            className={styles.codeInput}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="邮箱验证码"
            autoComplete="one-time-code"
          />
          <button
            type="button"
            className={styles.sendBtn}
            onClick={() => showToast('验证码发送未实现')}
          >
            发送
          </button>
        </div>
      ),
    },
    {
      name: 'password',
      label: '密码',
      placeholder: '密码',
      render: (value, onChange) => (
        <div className={styles.inputWrap}>
          <input
            className={styles.input}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="密码"
            autoComplete="new-password"
          />
          <button
            type="button"
            className={styles.suffixIconBtn}
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? '隐藏密码' : '显示密码'}
          >
            <EyeIcon on={showPassword} />
          </button>
        </div>
      ),
    },
    {
      name: 'password2',
      label: '再次输入密码',
      placeholder: '再次输入密码',
      render: (value, onChange) => (
        <div className={styles.inputWrap}>
          <input
            className={styles.input}
            type={showPassword2 ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="再次输入密码"
            autoComplete="new-password"
          />
          <button
            type="button"
            className={styles.suffixIconBtn}
            onClick={() => setShowPassword2(v => !v)}
            aria-label={showPassword2 ? '隐藏密码' : '显示密码'}
          >
            <EyeIcon on={showPassword2} />
          </button>
        </div>
      ),
    },
  ];

  const handleSubmit = (values: Record<string, unknown>) => {
    console.log('forget-password', values);
    showToast('重置密码未实现');
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <button className={styles.close} onClick={() => navigate('/')}>×</button>

        <div className={styles.header}>
          <div className={styles.title}>忘记密码</div>
        </div>

        <div className={styles.content}>
          <Form
            fields={fields}
            onSubmit={handleSubmit}
            submitText="重置密码"
            submitClassName={styles.primary}
            fieldClassName={styles.formField}
            className={styles.form}
          />
        </div>

        <div className={styles.footerBar}>
          <div className={styles.footerLeft}>
            <button className={styles.footerLink} onClick={() => navigate('/login')}>返回登录</button>
          </div>
        </div>
      </div>
    </div>
  );
}
