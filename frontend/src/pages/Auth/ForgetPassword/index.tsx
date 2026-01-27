import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "@/components/Form";
import { showToast } from "@/components/Toast";
import type { FormField } from "@/components/Form";
import buildFields from "../components/FieldsForm";
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
    >
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

  const primaryButtonClass =
    "w-full h-[56px] flex items-center justify-center gap-1.5 text-[18px] font-extrabold rounded-xl bg-[var(--brand-accent)] text-white border-0 shadow-[var(--brand-shadow)] transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-strong)] hover:shadow-[var(--brand-shadow)] active:scale-95";
  const smallButtonBase =
    "flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold rounded-xl border border-[var(--brand-border)] transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)] hover:-translate-y-[1px]";
  const smallPrimaryButton = `${smallButtonBase} text-[var(--brand-accent)] bg-white`;
  const smallNeutralButton = `${smallButtonBase} text-[var(--brand-accent)] bg-white`;
  const sendButtonClass =
    "h-[56px] min-w-[96px] px-[18px] box-border border border-[var(--brand-border)] bg-white text-[var(--brand-accent)] text-[16px] font-bold hover:bg-[var(--brand-accent-soft)] active:scale-95";

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

  const navAgree = createNavAgreeFields(navigate, goGuest, smallPrimaryButton, smallNeutralButton, "修改并登录即代表您已阅读并同意", "forget");

  return (
    <div
      className="w-[520px] max-w-[calc(100%-40px)] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.12)] px-[22px] pt-[22px] pb-[18px] relative animate-[pageEnter_300ms_ease-out] border border-[#6d28d9]"
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
