import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "@/components/Form";
import { showToast } from "@/components/Toast";
import type { FormField } from "@/components/Form";
import Button from "@/components/Button";

function EmailIcon() {
  return (
    <svg
      className="block"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      data-oid="tkot-ih"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
        data-oid="hsw32.7"
      />

      <path
        d="M3 7l9 6 9-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        data-oid="iod-ba4"
      />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg
      className="block"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      data-oid="2uwpu9h"
    >
      <circle
        cx="8"
        cy="15"
        r="4"
        stroke="currentColor"
        strokeWidth="1.8"
        data-oid="gf7va6y"
      />

      <path
        d="M11.5 12.5l9-9M16 8l1.5-1.5M19 11l1.5-1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        data-oid="3fsnz6j"
      />
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
      data-oid="p52:n9o"
    >
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
        data-oid="qy40loo"
      />

      <path
        d="M8 11V7a4 4 0 0 1 8 0v4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        data-oid="15tr4aa"
      />
    </svg>
  );
}

function EyeIcon({ on }: { on: boolean }) {
  return (
    <svg
      className="block"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      data-oid="_yaphbh"
    >
      {on ? (
        <>
          <path
            d="M2.2 12c1.9-4.7 5.4-7.5 9.8-7.5S19.9 7.3 21.8 12c-1.9 4.7-5.4 7.5-9.8 7.5S4.1 16.7 2.2 12Z"
            stroke="currentColor"
            strokeWidth="1.8"
            data-oid="qdnkpf3"
          />

          <path
            d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
            stroke="currentColor"
            strokeWidth="1.8"
            data-oid="o4ov1y_"
          />
        </>
      ) : (
        <>
          <path
            d="M3 12c2.1-4.7 5.6-7.5 9-7.5 3.4 0 6.9 2.8 9 7.5-2.1 4.7-5.6 7.5-9 7.5-3.4 0-6.9-2.8-9-7.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            data-oid="om71tej"
          />

          <path
            d="M4 4l16 16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            data-oid="el5iz.c"
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
      data-oid="7rex5m."
    >
      <path
        d="M4 12h10"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        data-oid="27bm0ws"
      />

      <path
        d="M11 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        data-oid="13pizj."
      />

      <path
        d="M20 4h-4M20 4v16M20 20h-4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        data-oid="-fyxc:e"
      />
    </svg>
  );
}

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const goGuest = () => {
    showToast("使用“游客模式”进入首页");
    navigate("/");
  };

  const fields: FormField[] = [
    {
      name: "email",
      label: "邮箱",
      placeholder: "邮箱",
      render: (value, onChange) => (
        <div
          className="w-full flex items-stretch box-border border border-[var(--brand-border)] bg-white overflow-hidden relative"
          data-oid="6toor.d"
        >
          <div
            className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none"
            data-oid="uj6tj1r"
          >
            <EmailIcon data-oid="jei6-pr" />
          </div>
          <input
            className="w-full h-[56px] pl-[56px] pr-4 box-border border-0 bg-transparent text-[16px] outline-none"
            id="forget-email"
            name="email"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="邮箱"
            data-oid="e_uw:4h"
          />
        </div>
      ),
    },
    {
      name: "emailCode",
      label: "邮箱验证码",
      placeholder: "邮箱验证码",
      render: (value, onChange) => (
        <div
          className="w-full flex items-stretch box-border border border-[var(--brand-border)] bg-white overflow-hidden relative"
          data-oid="x2jto6_"
        >
          <div
            className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none z-10"
            data-oid="uezo2jv"
          >
            <KeyIcon data-oid="5sdsy:-" />
          </div>
          <input
            className="h-[56px] flex-1 w-full pl-[56px] pr-[110px] box-border border-0 bg-transparent text-[16px] outline-none"
            id="forget-email-code"
            name="emailCode"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="邮箱验证码"
            autoComplete="one-time-code"
            data-oid="37.:qal"
          />

          <Button
            type="button"
            className={sendButtonClass}
            onClick={() => showToast("验证码发送未实现")}
            data-oid="h9a904l"
          >
            发送
          </Button>
        </div>
      ),
    },
    {
      name: "password",
      label: "密码",
      placeholder: "密码",
      render: (value, onChange) => (
        <div
          className="w-full flex items-stretch box-border border border-[var(--brand-border)] bg-white overflow-hidden relative"
          data-oid="sxdpyvh"
        >
          <div
            className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none"
            data-oid="zaue8s7"
          >
            <LockIcon data-oid="9l:.oid" />
          </div>
          <input
            className="h-[56px] w-full pl-[56px] pr-[56px] box-border border-0 bg-transparent text-[16px] outline-none"
            id="forget-password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="密码"
            autoComplete="new-password"
            data-oid="fn:y35z"
          />

          <button
            type="button"
            className="absolute right-0 top-0 border-0 bg-transparent text-[var(--brand-muted)] cursor-pointer w-[56px] h-[56px] p-0 inline-flex items-center justify-center box-border shadow-none outline-none leading-none"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "隐藏密码" : "显示密码"}
            data-oid="lgdztjv"
          >
            <EyeIcon on={showPassword} data-oid="nnnb66m" />
          </button>
        </div>
      ),
    },
    {
      name: "password2",
      label: "再次输入密码",
      placeholder: "再次输入密码",
      render: (value, onChange) => (
        <div
          className="w-full flex items-stretch box-border border border-[var(--brand-border)] bg-white overflow-hidden relative"
          data-oid="5-6w:2n"
        >
          <div
            className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none"
            data-oid="7c8td6x"
          >
            <LockIcon data-oid="92a6e63" />
          </div>
          <input
            className="h-[56px] w-full pl-[56px] pr-[56px] box-border border-0 bg-transparent text-[16px] outline-none"
            id="forget-password-confirm"
            name="password2"
            type={showPassword2 ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="再次输入密码"
            autoComplete="new-password"
            data-oid="nd:.1n8"
          />

          <button
            type="button"
            className="absolute right-0 top-0 border-0 bg-transparent text-[var(--brand-muted)] cursor-pointer w-[56px] h-[56px] p-0 inline-flex items-center justify-center box-border shadow-none outline-none leading-none"
            onClick={() => setShowPassword2((v) => !v)}
            aria-label={showPassword2 ? "隐藏密码" : "显示密码"}
            data-oid="biwm29."
          >
            <EyeIcon on={showPassword2} data-oid="00mriur" />
          </button>
        </div>
      ),
    },
  ];

  const handleSubmit = (values: Record<string, unknown>) => {
    console.log("forget-password", values);
    showToast("重置密码未实现");
  };

  const primaryButtonClass =
    "w-full h-[56px] bg-[#f3e8ff] text-[#6d28d9] border border-[#d8b4fe] text-[18px] font-extrabold cursor-pointer transition-[background,border-color,transform] flex items-center justify-center gap-3.5 hover:bg-[#e9d5ff] hover:-translate-y-[1px] active:scale-95";
  const smallButtonBase =
    "px-3 py-1.5 rounded-full text-[15px] font-semibold border transition-[background,border-color,transform] hover:-translate-y-[1px] active:scale-95";
  const smallPrimaryButton =
    `${smallButtonBase} bg-white text-[#6d28d9] border-[#d8b4fe] hover:bg-[#f3e8ff]`;
  const smallNeutralButton =
    `${smallButtonBase} bg-white text-[#6d28d9] border-[#d8b4fe] hover:bg-[#f3e8ff]`;
  const sendButtonClass =
    "h-[56px] min-w-[96px] px-[18px] box-border border-l border-[#d8b4fe] bg-[#f3e8ff] text-[#6d28d9] text-[16px] font-bold hover:bg-[#e9d5ff] active:scale-95";

  return (
    <div
      className="w-[520px] max-w-[calc(100%-40px)] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.12)] px-[22px] pt-[22px] pb-[18px] relative animate-[pageEnter_300ms_ease-out]"
      data-oid="gusoamy"
    >
      <div className="py-3 pb-1.5 text-center" data-oid="7zn4se7">
        <div
          className="text-[44px] leading-[1.05] font-extrabold text-[var(--brand-text)] tracking-[0.02em]"
          data-oid="f89lafo"
        >
          nju-edu-ai
        </div>
      </div>

      <div className="px-[26px] pt-[18px] pb-[10px]" data-oid="phwgzka">
        <Form
          fields={fields}
          onSubmit={handleSubmit}
          submitText={
            <>
              <EnterIcon data-oid="zrx_i3j" />
              <span data-oid="sr9zmqg">重置密码</span>
            </>
          }
          submitClassName={primaryButtonClass}
          fieldClassName="relative [&>label]:sr-only col-span-2"
          className="flex flex-col gap-3.5"
          data-oid="7e2a2_3"
        />
      </div>

      <div
        className="px-[26px] pt-1.5 flex justify-between items-center"
        data-oid="1v5:-.b"
      >
        <div className="inline-flex gap-3 items-center" data-oid="eyka67n">
          <Button
            className={smallPrimaryButton}
            onClick={() => navigate("/login")}
            data-oid=".s1-0.w"
          >
            返回登录
          </Button>
        </div>

        <div className="inline-flex items-center" data-oid="rbp96dn">
          <Button
            className={smallNeutralButton}
            onClick={goGuest}
            data-oid="yu8iyzz"
          >
            游客模式
          </Button>
        </div>
      </div>
    </div>
  );
}
