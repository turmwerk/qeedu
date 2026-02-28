import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "@/components/Form";
import { showToast } from "@/components/Toast";
import type { FormField } from "@/components/Form";
import EyeTooltip from "../components/EyeTooltip";

import createNavAgreeFields from "../components/NavAgree";

function IdIcon() {
  return (
    <svg className="block" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function KeyIcon() {
  return (
    <svg className="block" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8" cy="15" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M11.5 12.5l9-9M16 8l1.5-1.5M19 11l1.5-1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="block"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ on }: { on: boolean }) {
  return (
    <svg className="block" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {on ? (
        <>
          <path d="M2.2 12c1.9-4.7 5.4-7.5 9.8-7.5S19.9 7.3 21.8 12c-1.9 4.7-5.4 7.5-9.8 7.5S4.1 16.7 2.2 12Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.8" />
        </>
      ) : (
        <>
          <path d="M3 12c2.1-4.7 5.6-7.5 9-7.5 3.4 0 6.9 2.8 9 7.5-2.1 4.7-5.6 7.5-9 7.5-3.4 0-6.9-2.8-9-7.5Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function EnterIcon() {
  return (
    <svg className="inline-block flex-[0_0_auto]" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M11 7l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 4h-4M20 4v16M20 20h-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Resister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const goGuest = () => {
    showToast("使用“游客模式”进入首页");
    navigate("/");
  };

  const primaryButtonClass =
    "w-full h-[56px] flex items-center justify-center gap-1.5 text-[18px] font-extrabold rounded-xl bg-[var(--brand-blue)] text-white border-0 shadow-[var(--brand-shadow)] transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-purple)] hover:shadow-[var(--brand-shadow)] active:scale-95";
  


  const fields: FormField[] = [
    {
      name: "email",
      label: "邮箱/手机号",
      placeholder: "邮箱或手机号",
      render: (value, onChange) => (
          <div className="w-full flex items-stretch box-border border border-[var(--brand-blue)] hover:border-[var(--brand-purple)] focus-within:border-[var(--brand-purple)] transition-colors bg-white overflow-hidden relative rounded-2xl">
          <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
            <IdIcon />
          </div>
          <input
            className="auth-field-input w-full h-[56px] pl-[56px] pr-4 box-border border-0 bg-transparent text-[16px] outline-none rounded-2xl appearance-none"
            id="register-email"
            name="email"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="邮箱或手机号"
          />
        </div>
      ),
    },
    {
      name: "emailCode",
      label: "验证码",
      placeholder: "验证码",
      render: (value, onChange) => (
        <div
          className="w-full flex items-stretch box-border border border-[var(--brand-blue)] hover:border-[var(--brand-purple)] focus-within:border-[var(--brand-purple)] transition-colors bg-white overflow-hidden relative rounded-2xl"
          data-oid="0gz.p8p"
        >
          <div
            className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none z-10"
            data-oid="h1ic:wi"
          >
            <KeyIcon data-oid="ua0ofky" />
          </div>
          <input
            className="auth-field-input h-[56px] flex-1 w-full pl-[56px] pr-[110px] box-border border-0 bg-transparent text-[16px] outline-none rounded-2xl appearance-none"
            id="register-email-code"
            name="emailCode"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="验证码"
            autoComplete="one-time-code"
            data-oid="gp087c6"
          />

          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brand-blue)] hover:text-[var(--brand-purple)] font-bold bg-transparent border-0"
            onClick={() => showToast("验证码发送未实现")}
            data-oid="c860_1o"
          >
            获取验证码
          </button>
        </div>
      ),
    },
    {
      name: "password",
      label: "密码",
      placeholder: "密码",
      render: (value, onChange) => (
        <div
          className="w-full flex items-stretch box-border border border-[var(--brand-blue)] hover:border-[var(--brand-purple)] focus-within:border-[var(--brand-purple)] transition-colors bg-white overflow-visible relative rounded-2xl"
          data-oid="yhovq6e"
        >
          <div
            className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none"
            data-oid="3ygbfie"
          >
            <LockIcon data-oid="f.p.2sn" />
          </div>
          <input
            className="auth-field-input h-[56px] w-full pl-[56px] pr-[56px] box-border border-0 bg-transparent text-[16px] outline-none rounded-2xl appearance-none"
            id="register-password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="密码"
            autoComplete="new-password"
            data-oid="8n_06g6"
          />

          <EyeTooltip on={showPassword} onToggle={() => setShowPassword((v) => !v)} ariaLabel={showPassword ? "隐藏密码" : "显示密码"}>
            <EyeIcon on={showPassword} data-oid="-nnyyp." />
          </EyeTooltip>
        </div>
      ),
    },
    {
      name: "password2",
      label: "再次输入密码",
      placeholder: "再次输入密码",
      render: (value, onChange) => (
        <div
          className="w-full flex items-stretch box-border border border-[var(--brand-blue)] hover:border-[var(--brand-purple)] focus-within:border-[var(--brand-purple)] transition-colors bg-white overflow-visible relative rounded-2xl"
          data-oid="hkpjtmk"
        >
          <div
            className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none"
            data-oid="--p99_p"
          >
            <LockIcon data-oid="ch_vh-t" />
          </div>
          <input
            className="auth-field-input h-[56px] w-full pl-[56px] pr-[56px] box-border border-0 bg-transparent text-[16px] outline-none rounded-2xl appearance-none"
            id="register-password-confirm"
            name="password2"
            type={showPassword2 ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="再次输入密码"
            autoComplete="new-password"
            data-oid="j6-:3ie"
          />

          <EyeTooltip on={showPassword2} onToggle={() => setShowPassword2((v) => !v)} ariaLabel={showPassword2 ? "隐藏密码" : "显示密码"}>
            <EyeIcon on={showPassword2} data-oid="8boa4sf" />
          </EyeTooltip>
        </div>
      ),
    },
  ];

  const handleSubmit = (values: Record<string, unknown>) => {
    console.log("register", values);
    showToast("注册未实现");
  };

  const navAgree = createNavAgreeFields(navigate, goGuest, "注册并登录即代表您已阅读并同意", "register");

  return (
    <div
      className="auth-panel w-[520px] max-w-[calc(100%-40px)] px-[22px] pt-[22px] pb-[18px] relative animate-[pageEnter_300ms_ease-out] rounded-xl"
      data-oid="j48j102"
    >
      <div className="py-3 pb-1.5 text-center" data-oid="6pkt29u">
        <div className="text-[32px] font-extrabold text-[var(--brand-text)]">注册</div>
      </div>
      <div className="px-[26px] pt-[18px] pb-[10px]" data-oid="sxw10y7">
        <Form
          fields={fields.concat(navAgree)}
          onSubmit={handleSubmit}
          submitText={
            <>
                  <EnterIcon data-oid="sojo3:7" />
                  <span data-oid=".iab:ea">注册并登录</span>
            </>
          }
          submitClassName={primaryButtonClass}
          fieldClassName="relative [&>label]:sr-only"
          className="flex flex-col gap-1"
          data-oid="nk485g0"
        />
      </div>


      
    </div>
  );
}
