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

function EnterIcon() {
  return (
    <svg
      className={styles.actionIcon}
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 12h10"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M11 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 4h-4M20 4v16M20 20h-4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const goGuest = () => {
    showToast('使用“游客模式”进入首页');
    navigate('/');
  };

  const fields: FormField[] = [
    { name: 'account', label: '用户名或邮箱', placeholder: '用户名或邮箱' },
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
            autoComplete="current-password"
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
  ];

  const handleSubmit = (values: Record<string, unknown>) => {
    // 登录未实现
    console.log('login', values);
    showToast('登录功能未接入，使用“游客模式”进入首页');
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <div className={styles.header}>
          <div className={styles.title}>nju-edu-ai</div>
        </div>

        <div className={styles.content}>
          <Form
            fields={fields}
            onSubmit={handleSubmit}
            submitText={
              <>
                <EnterIcon />
                <span>登录</span>
              </>
            }
            submitClassName={styles.primary}
            fieldClassName={styles.formField}
            className={styles.form}
          />
        </div>

        <div className={styles.footerBar}>
          <div className={styles.footerLeft}>
            <button className={styles.footerLink} onClick={() => navigate('/register')}>注册</button>
            <span className={styles.footerSep}>|</span>
            <button className={styles.footerLink} onClick={() => navigate('/forget-password')}>忘记密码</button>
          </div>

          <div className={styles.footerRight}>
            <button className={styles.footerLink} onClick={goGuest}>游客模式</button>
          </div>
        </div>
      </div>
    </div>
  );
}
