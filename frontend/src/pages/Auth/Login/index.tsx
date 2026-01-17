import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '@/components/Form';
import { showToast } from '@/components/Toast';
import type { FormField } from '@/components/Form';

function EyeIcon({ on }: { on: boolean }) {
  return (
    <svg
      className="block"
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
      className="inline-block flex-[0_0_auto]"
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
    { 
      name: 'account', 
      label: '用户名或邮箱', 
      placeholder: '用户名或邮箱',
      render: (value, onChange) => (
        <input
          className="w-full h-[56px] px-4 box-border border border-[var(--brand-border)] bg-white text-[16px] outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="用户名或邮箱"
        />
      )
    },
    {
      name: 'password',
      label: '密码',
      placeholder: '密码',
      render: (value, onChange) => (
        <div className="w-full flex items-stretch box-border border border-[var(--brand-border)] bg-white overflow-hidden relative">
          <input
            className="h-[56px] w-full px-4 pr-[56px] box-border border-0 bg-transparent text-[16px] outline-none"
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="密码"
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute right-0 top-0 border-0 bg-transparent text-[var(--brand-muted)] cursor-pointer w-[56px] h-[56px] p-0 inline-flex items-center justify-center box-border shadow-none outline-none leading-none"
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
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.08)] flex items-center justify-center z-[1000] backdrop-blur-[4px]">
      <div className="w-[520px] max-w-[calc(100%-40px)] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.12)] px-[22px] pt-[22px] pb-[18px] relative">
        <div className="py-3 pb-1.5 text-center">
          <div className="text-[44px] leading-[1.05] font-extrabold text-[var(--brand-text)] tracking-[0.02em]">nju-edu-ai</div>
        </div>

        <div className="px-[26px] pt-[18px] pb-[10px]">
          <Form
            fields={fields}
            onSubmit={handleSubmit}
            submitText={
              <>
                <EnterIcon />
                <span>登录</span>
              </>
            }
            submitClassName="w-full h-[56px] bg-[var(--brand-accent)] text-white border-0 text-[18px] font-extrabold cursor-pointer shadow-[var(--brand-shadow)] transition-[background,box-shadow] flex items-center justify-center gap-3.5 hover:bg-[var(--brand-accent-strong)]"
            fieldClassName="relative [&>label]:sr-only"
            className="flex flex-col gap-3.5"
          />
        </div>

        <div className="px-[26px] pt-1.5 flex justify-between items-center">
          <div className="inline-flex gap-3 items-center">
            <button className="bg-transparent border-0 text-[var(--brand-accent)] cursor-pointer px-0.5 py-1.5 text-[16px] hover:underline" onClick={() => navigate('/register')}>注册</button>
            <span className="text-[rgba(0,0,0,0.3)]">|</span>
            <button className="bg-transparent border-0 text-[var(--brand-accent)] cursor-pointer px-0.5 py-1.5 text-[16px] hover:underline" onClick={() => navigate('/forget-password')}>忘记密码</button>
          </div>

          <div className="inline-flex items-center">
            <button className="bg-transparent border-0 text-[var(--brand-accent)] cursor-pointer px-0.5 py-1.5 text-[16px] hover:underline" onClick={goGuest}>游客模式</button>
          </div>
        </div>
      </div>
    </div>
  );
}
