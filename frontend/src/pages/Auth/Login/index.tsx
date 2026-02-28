import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "@/components/Form";
import { showToast } from "@/components/Toast";
import type { FormField } from "@/components/Form";
import Tabs from "../components/Tabs";
import buildFields from "../components/FieldsForm";
import createNavAgreeFields from "../components/NavAgree";



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
    "w-full h-[56px] flex items-center justify-center gap-1.5 text-[18px] font-extrabold rounded-xl bg-[var(--brand-blue)] text-white border-0 shadow-[var(--brand-shadow)] transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-purple)] hover:shadow-[var(--brand-shadow)] active:scale-95";
  
  const sendButtonClass =
    "h-[56px] min-w-[96px] px-[18px] box-border border border-[var(--brand-blue)] bg-white text-[var(--brand-blue)] text-[16px] font-bold hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-purple)] active:scale-95";
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
  
  const navAgree = createNavAgreeFields(navigate, goGuest, "登录即代表您已阅读并同意", "login");

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
      className="auth-panel w-[520px] max-w-[calc(100%-40px)] px-[22px] pt-[22px] pb-[18px] relative animate-[pageEnter_300ms_ease-out] rounded-xl"
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
