import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "@/components/Form";
import { showToast } from "@/components/Toast";
import type { FormField } from "@/components/Form";
import buildFields from "../components/FieldsForm";
import createNavAgreeFields from "../components/NavAgree";
import AuthPanelActions from "../components/AuthPanelActions";

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
  const sendButtonClass =
    "h-[56px] min-w-[96px] px-[18px] box-border border border-[var(--brand-blue)] bg-white text-[var(--brand-blue)] text-[16px] font-bold hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-purple)] active:scale-95";

  const fields: FormField[] = buildFields("register", {
    showPassword,
    setShowPassword,
    showPassword2,
    setShowPassword2,
    sendButtonClass,
  });

  const handleSubmit = (values: Record<string, unknown>) => {
    console.log("register", values);
    showToast("注册未实现");
  };

  const navAgree = createNavAgreeFields(navigate, goGuest, "注册并登录即代表您已阅读并同意", "register");

  return (
    <div
      className="auth-panel w-[520px] max-w-[calc(100%-12px)] px-3 sm:px-[22px] pt-[30px] pb-[18px] relative animate-[pageEnter_300ms_ease-out] rounded-xl"
      data-oid="j48j102"
    >
      <div className="absolute top-0 right-0 z-20">
        <AuthPanelActions />
      </div>
      <div className="px-4 sm:px-[26px] pt-0 pb-[10px]" data-oid="sxw10y7">
        <div className="text-[30px] font-extrabold text-[var(--brand-text)] leading-none text-center mb-6">注册</div>
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
          fieldClassName="relative [&>label]:sr-only col-span-2"
          className="flex flex-col gap-1"
          data-oid="nk485g0"
        />
      </div>


      
    </div>
  );
}
