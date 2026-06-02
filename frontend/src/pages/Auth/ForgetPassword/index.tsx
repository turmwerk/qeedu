import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "@/ui/Form";
import { showToast } from "@/ui/Toast";
import type { FormField } from "@/ui/Form";
import buildFields from "../FieldsForm";
import createNavAgreeFields from "../NavAgree";
import AuthPanelActions from "../AuthPanelActions";
import { resetPasswordWithEmail, sendEmailCode } from "@/api/auth";



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
  const [submitting, setSubmitting] = useState(false);

  const goGuest = () => {
    showToast("使用“游客模式”进入首页");
    navigate("/");
  };

  const primaryButtonClass =
    "auth-primary-action w-full h-[56px] flex items-center justify-center gap-2 text-[16px] font-semibold rounded-xl transition-[background,border-color,color,transform] active:scale-95";

  const sendButtonClass =
    "auth-primary-action h-[56px] min-w-[96px] px-[18px] box-border text-[16px] font-semibold active:scale-95";

  const fields: FormField[] = buildFields("forget", {
    showPassword,
    setShowPassword,
    showPassword2,
    setShowPassword2,
    sendButtonClass,
    onSendCode: async (_field, email) => {
      const normalized = email.trim();
      if (!normalized) {
        showToast("请先输入邮箱");
        return;
      }
      try {
        const res = await sendEmailCode(normalized, "reset");
        showToast(res.dev_code ? `验证码：${res.dev_code}` : "验证码已发送");
      } catch (err) {
        showToast(err instanceof Error ? err.message : "验证码发送失败");
      }
    },
  });

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (submitting) return;
    const email = String(values.email ?? "").trim();
    const code = String(values.emailCode ?? "").trim();
    const password = String(values.password ?? "");
    const password2 = String(values.password2 ?? "");
    if (!email || !code || !password) {
      showToast("请填写邮箱、验证码和新密码");
      return;
    }
    if (password !== password2) {
      showToast("两次输入的密码不一致");
      return;
    }
    setSubmitting(true);
    try {
      await resetPasswordWithEmail({
        email,
        code,
        new_password: password,
      });
      window.dispatchEvent(new Event("auth-change"));
      showToast("密码已重置");
      navigate("/");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "重置密码失败");
    } finally {
      setSubmitting(false);
    }
  };

  const navAgree = createNavAgreeFields(navigate, goGuest, "修改并登录即代表您已阅读并同意", "forget");

  return (
    <div
      className="auth-panel w-[520px] max-w-[calc(100%-12px)] px-3 sm:px-[22px] pt-[30px] pb-[18px] relative animate-[pageEnter_300ms_ease-out] rounded-xl"
      data-oid="gusoamy"
    >
      <div className="absolute top-0 right-0 z-20">
        <AuthPanelActions />
      </div>
      <div className="px-4 sm:px-[26px] pt-0 pb-[10px]" data-oid="phwgzka">
        <div className="text-[30px] font-extrabold text-[var(--brand-text)] leading-none text-center mb-6">重置密码</div>
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
          submitLoading={submitting}
          fieldClassName="relative [&>label]:sr-only col-span-2"
          className="flex flex-col gap-1"
          data-oid="7e2a2_3"
        />
      </div>

      
    </div>
  );
}
