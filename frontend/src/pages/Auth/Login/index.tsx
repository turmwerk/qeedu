import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "@/components/Form";
import { showToast } from "@/components/Toast";
import type { FormField } from "@/components/Form";
import Tabs from "../components/Tabs";
import buildFields from "../components/FieldsForm";
import createNavAgreeFields from "../components/NavAgree";

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
  const [mode, setMode] = useState<"password" | "sms">("password");

  const goGuest = () => {
    showToast("使用“游客模式”进入首页");
    navigate("/");
  };

  // 两种表单会通过共享 builder 生成（下方 buildFields）
  const primaryButtonClass =
    "w-full h-[56px] flex items-center justify-center gap-1.5 text-[18px] font-extrabold rounded-xl bg-blue-600 text-white border-0 shadow-[var(--brand-shadow)] transition-[background,border-color,box-shadow,transform] hover:bg-[#6d28d9] hover:shadow-[var(--brand-shadow)] active:scale-95";
  const smallButtonBase =
    "flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold rounded-xl border border-blue-600 transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[#6d28d9] hover:shadow-[var(--brand-shadow)] hover:-translate-y-[1px]";
  const smallPrimaryButton = `${smallButtonBase} text-[var(--brand-accent)] bg-white`;
  const smallNeutralButton = `${smallButtonBase} text-[var(--brand-accent)] bg-white`;
  const sendButtonClass =
    "h-[56px] min-w-[96px] px-[18px] box-border border border-blue-600 bg-white text-blue-600 text-[16px] font-bold hover:bg-[var(--brand-accent-soft)] hover:border-[#6d28d9] active:scale-95";
  // build fields via shared builder
  const passwordFields: FormField[] = buildFields("login-password", {
    showPassword,
    setShowPassword,
    sendButtonClass,
  });

  const smsFields: FormField[] = buildFields("login-sms", {
    showPassword,
    setShowPassword,
    sendButtonClass,
  });

  // 在表单中添加导航行与协议提示（span=2），会显示在提交按钮上方
  
  const navAgree = createNavAgreeFields(navigate, goGuest, smallPrimaryButton, smallNeutralButton, "登录即代表您已阅读并同意", "login");

  const handleSubmit = (values: Record<string, unknown>) => {
    console.log("login", values, "mode", mode);
    if (mode === "password") {
      showToast("账密登录未接入，使用“游客模式”进入首页");
    } else {
      showToast("验证码登录未接入，使用“游客模式”进入首页");
    }
  };

  return (
    <div
      className="w-[520px] max-w-[calc(100%-40px)] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.12)] px-[22px] pt-[22px] pb-[18px] relative animate-[pageEnter_300ms_ease-out] rounded-xl border border-[#6d28d9] shadow-[var(--brand-shadow)]"
      data-oid="si9z1-w"
    >
      <div className="py-3 pb-1.5 text-center" data-oid="y4lag62">
        <div className="text-[32px] font-extrabold text-[var(--brand-text)]">登录</div>
      </div>

      <div className="px-[26px] pt-[18px] pb-[10px]">
        <Tabs mode={mode} setMode={setMode} />

        <style>{`
          @keyframes slideInFromBottom { from { opacity: 0; transform: translateY(8px); } to { opacity:1; transform:translateY(0);} }
          .animate-form-enter { animation: slideInFromBottom 220ms cubic-bezier(.2,.9,.2,1) both; }
        `}</style>

        <Form
          fields={(mode === "password" ? passwordFields : smsFields).concat(navAgree)}
          onSubmit={handleSubmit}
          submitText={
            <>
              <EnterIcon />
              <span>登录</span>
            </>
          }
          submitClassName={primaryButtonClass}
          fieldClassName="relative [&>label]:sr-only col-span-2"
          className="flex flex-col gap-1"
          animateFieldsKey={mode}
        />
      </div>

      
    </div>
  );
}
