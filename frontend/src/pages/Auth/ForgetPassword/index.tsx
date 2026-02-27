import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "@/components/Form";
import { showToast } from "@/components/Toast";
import type { FormField } from "@/components/Form";
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

  const primaryButtonClass =
    "w-full h-[56px] flex items-center justify-center gap-1.5 text-[18px] font-extrabold rounded-xl bg-blue-600 text-white border-0 shadow-[var(--brand-shadow)] transition-[background,border-color,box-shadow,transform] hover:bg-[#6d28d9] hover:shadow-[var(--brand-shadow)] active:scale-95";
  
  const sendButtonClass =
    "h-[56px] min-w-[96px] px-[18px] box-border border border-blue-600 bg-white text-blue-600 text-[16px] font-bold hover:bg-[var(--brand-accent-soft)] hover:border-[#6d28d9] active:scale-95";

  const fields: FormField[] = buildFields("forget", {
    showPassword,
    setShowPassword,
    showPassword2,
    setShowPassword2,
    sendButtonClass,
  });

  const handleSubmit = (values: Record<string, unknown>) => {
    console.log("forget-password", values);
    showToast("重置密码未实现");
  };

  const navAgree = createNavAgreeFields(navigate, goGuest, "修改并登录即代表您已阅读并同意", "forget");

  return (
    <div
      className="auth-panel w-[520px] max-w-[calc(100%-40px)] px-[22px] pt-[22px] pb-[18px] relative animate-[pageEnter_300ms_ease-out] rounded-xl"
      data-oid="gusoamy"
    >
      <div className="py-3 pb-1.5 text-center" data-oid="7zn4se7">
        <div className="text-[32px] font-extrabold text-[var(--brand-text)]">重置密码</div>
      </div>

      <div className="px-[26px] pt-[18px] pb-[10px]" data-oid="phwgzka">
        <Form
          fields={fields.concat(navAgree)}
          onSubmit={handleSubmit}
          submitText={
            <>
              <EnterIcon data-oid="zrx_i3j" />
              <span data-oid="sr9zmqg">重置密码</span>
            </>
          }
          submitClassName={primaryButtonClass}
          fieldClassName="relative [&>label]:sr-only col-span-2"
          className="flex flex-col gap-1"
          data-oid="7e2a2_3"
        />
      </div>

      
    </div>
  );
}
