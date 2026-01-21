import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "@/components/Form";
import { showToast } from "@/components/Toast";
import type { FormField } from "@/components/Form";
import Button from "@/components/Button";

function UserIcon() {
  return (
    <svg
      className="block"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      data-oid="0yrj2s."
    >
      <path
        d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        data-oid="vv5l324"
      />

      <path
        d="M3 22c0-4.4 4-8 9-8s9 3.6 9 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        data-oid="ew11zt_"
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
      data-oid="z4v75ox"
    >
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
        data-oid="eri1c66"
      />

      <path
        d="M8 11V7a4 4 0 0 1 8 0v4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        data-oid="b9t7c4p"
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
      data-oid="zcj6o1n"
    >
      {on ? (
        <>
          <path
            d="M2.2 12c1.9-4.7 5.4-7.5 9.8-7.5S19.9 7.3 21.8 12c-1.9 4.7-5.4 7.5-9.8 7.5S4.1 16.7 2.2 12Z"
            stroke="currentColor"
            strokeWidth="1.8"
            data-oid="24:_hs-"
          />

          <path
            d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
            stroke="currentColor"
            strokeWidth="1.8"
            data-oid="a2bdzoh"
          />
        </>
      ) : (
        <>
          <path
            d="M3 12c2.1-4.7 5.6-7.5 9-7.5 3.4 0 6.9 2.8 9 7.5-2.1 4.7-5.6 7.5-9 7.5-3.4 0-6.9-2.8-9-7.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            data-oid="e709i6w"
          />

          <path
            d="M4 4l16 16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            data-oid="s-3ba1_"
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
      data-oid="nn572mm"
    >
      <path
        d="M4 12h10"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        data-oid="nxmp:o-"
      />

      <path
        d="M11 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        data-oid="o9tpz21"
      />

      <path
        d="M20 4h-4M20 4v16M20 20h-4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        data-oid="rjfe9e6"
      />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const goGuest = () => {
    showToast("使用“游客模式”进入首页");
    navigate("/");
  };

  const fields: FormField[] = [
    {
      name: "account",
      label: "用户名或邮箱",
      placeholder: "用户名或邮箱",
      render: (value, onChange) => (
        <div
          className="w-full flex items-stretch box-border border border-[var(--brand-border)] bg-white overflow-hidden relative"
          data-oid="7k7.nd7"
        >
          <div
            className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none"
            data-oid="r8cw3-h"
          >
            <UserIcon data-oid="158vlog" />
          </div>
          <input
            className="w-full h-[56px] pl-[56px] pr-4 box-border border-0 bg-transparent text-[16px] outline-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="用户名或邮箱"
            data-oid="cplps:4"
          />
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
          data-oid="c8.4hi0"
        >
          <div
            className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none"
            data-oid="no:s9bg"
          >
            <LockIcon data-oid="-0rfv.2" />
          </div>
          <input
            className="h-[56px] w-full pl-[56px] pr-[56px] box-border border-0 bg-transparent text-[16px] outline-none"
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="密码"
            autoComplete="current-password"
            data-oid="mvllwxt"
          />

          <Button
            type="button"
            className="absolute right-0 top-0 border-0 bg-transparent text-[var(--brand-muted)] w-[56px] h-[56px] p-0 inline-flex items-center justify-center box-border shadow-none outline-none leading-none"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "隐藏密码" : "显示密码"}
            data-oid="ug:f1pm"
          >
            <EyeIcon on={showPassword} data-oid="dhp3a7j" />
          </Button>
        </div>
      ),
    },
  ];

  const handleSubmit = (values: Record<string, unknown>) => {
    // 登录未实现
    console.log("login", values);
    showToast("登录功能未接入，使用“游客模式”进入首页");
  };

  const primaryButtonClass =
    "w-full h-[56px] bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe] text-[18px] font-extrabold cursor-pointer shadow-[0_10px_25px_rgba(59,130,246,0.2)] transition-[background,box-shadow,transform] flex items-center justify-center gap-3.5 hover:bg-[#dbeafe] hover:shadow-[0_12px_28px_rgba(59,130,246,0.28)] hover:-translate-y-[1px]";
  const smallButtonBase =
    "px-3 py-1.5 rounded-full text-[15px] font-semibold border transition-[background,border-color,box-shadow,transform] hover:-translate-y-[1px]";
  const smallPrimaryButton =
    `${smallButtonBase} bg-white text-[#1d4ed8] border-[#bfdbfe] hover:bg-[#eff6ff] hover:shadow-[0_8px_18px_rgba(59,130,246,0.2)]`;
  const smallNeutralButton =
    `${smallButtonBase} bg-white text-[#475569] border-[var(--brand-border)] hover:shadow-[0_8px_18px_rgba(15,23,42,0.12)]`;

  return (
    <div
      className="w-[520px] max-w-[calc(100%-40px)] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.12)] px-[22px] pt-[22px] pb-[18px] relative"
      data-oid="si9z1-w"
    >
      <div className="py-3 pb-1.5 text-center" data-oid="y4lag62">
        <div
          className="text-[44px] leading-[1.05] font-extrabold text-[var(--brand-text)] tracking-[0.02em]"
          data-oid="8.:wc94"
        >
          nju-edu-ai
        </div>
      </div>

      <div className="px-[26px] pt-[18px] pb-[10px]" data-oid="yzb8-_s">
        <Form
          fields={fields}
          onSubmit={handleSubmit}
          submitText={
            <>
              <EnterIcon data-oid="g1-_8d6" />
              <span data-oid="k:7s1e-">登录</span>
            </>
          }
          submitClassName={primaryButtonClass}
          fieldClassName="relative [&>label]:sr-only col-span-2"
          className="flex flex-col gap-3.5"
          data-oid="i8kfphu"
        />
      </div>

      <div
        className="px-[26px] pt-1.5 flex justify-between items-center"
        data-oid="6ydi:ss"
      >
        <div className="inline-flex gap-3 items-center" data-oid="ujeralt">
          <Button
            className={smallPrimaryButton}
            onClick={() => navigate("/register")}
            data-oid="e-:w90c"
          >
            注册
          </Button>
          <span className="text-[rgba(0,0,0,0.3)]" data-oid="rieg_u6">
            |
          </span>
          <Button
            className={smallPrimaryButton}
            onClick={() => navigate("/forget-password")}
            data-oid="a_le.-i"
          >
            忘记密码
          </Button>
        </div>

        <div className="inline-flex items-center" data-oid="d69hs.f">
          <Button
            className={smallNeutralButton}
            onClick={goGuest}
            data-oid="rvcp8wt"
          >
            游客模式
          </Button>
        </div>
      </div>
    </div>
  );
}
