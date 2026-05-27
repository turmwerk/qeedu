import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Form from "@/ui/Form";
import { showToast } from "@/ui/Toast";
import type { FormField } from "@/ui/Form";
import { setToken } from "@/hooks/useAuth";
import Tabs from "../Tabs";
import buildFields from "../FieldsForm";
import createNavAgreeFields from "../NavAgree";
import AuthPanelActions from "../AuthPanelActions";
import GitHubIcon from "@/ui/Icon/GitHubIcon";
import GoogleIcon from "@/ui/Icon/GoogleIcon";
import MailIcon from "@/ui/Icon/MailIcon";
import UserIcon from "@/ui/Icon/UserIcon";
import EnterIcon from "@/ui/Icon/EnterIcon";
import { apiUrl } from "@/api/config";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"password" | "sms" | "quick">("quick");

  const goGuest = () => {
    showToast(`\u4f7f\u7528\u201c\u6e38\u5ba2\u6a21\u5f0f\u201d\u8fdb\u5165\u9996\u9875`);
    navigate("/");
  };

  /* ── Handle OAuth result from backend redirect ── */
  useEffect(() => {
    const provider = searchParams.get("oauth_provider");
    const error = searchParams.get("oauth_error");
    const name = searchParams.get("oauth_name");
    const token = searchParams.get("oauth_token");

    if (!provider && !error) return;

    // Clean URL
    setSearchParams({}, { replace: true });

    if (error) {
      showToast(`OAuth \u767b\u5f55\u5931\u8d25: ${error}`);
      return;
    }

    // Persist JWT
    if (token) {
      setToken(token);
    }
    const label = provider === "github" ? "GitHub" : "Google";
    showToast(`${label} \u767b\u5f55\u6210\u529f\uff0c\u6b22\u8fce ${name || "\u7528\u6237"}`);
    navigate("/");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Form fields ── */
  const primaryButtonClass =
    "w-full h-[56px] flex items-center justify-center gap-1.5 text-[18px] font-extrabold rounded-xl bg-[var(--brand-blue)] text-white border-0 shadow-[var(--brand-shadow)] transition-[background,border-color,box-shadow,transform] hover:bg-[var(--brand-purple)] hover:shadow-[var(--brand-shadow)] active:scale-95";

  const sendButtonClass =
    "h-[56px] min-w-[96px] px-[18px] box-border border border-[var(--brand-blue)] bg-white text-[var(--brand-blue)] text-[16px] font-bold hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-purple)] active:scale-95";

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

  const navAgree = createNavAgreeFields(
    navigate,
    goGuest,
    "登录即代表您已阅读并同意",
    "login",
  );

  const handleSubmit = (values: Record<string, unknown>) => {
    console.log("login", values, "mode", mode);
    if (mode === "password") {
      showToast(`账密登录未接入，使用\u201c游客模式\u201d进入首页`);
    } else {
      showToast(`验证码登录未接入，使用\u201c游客模式\u201d进入首页`);
    }
  };

  return (
    <div
      className="auth-panel w-[520px] max-w-[calc(100%-12px)] px-3 sm:px-[22px] pt-[30px] pb-[18px] relative animate-[pageEnter_300ms_ease-out] rounded-xl"
      data-oid="si9z1-w"
    >
      <div className="absolute top-0 right-0 z-20">
        <AuthPanelActions />
      </div>
      <div className="px-4 sm:px-[26px] pt-0 pb-[10px]">
        <div className="text-[30px] font-extrabold text-[var(--brand-text)] leading-none text-center mb-6">
          登录
        </div>
        <style>{`
          @keyframes slideInFromBottom { from { opacity: 0; transform: translateY(8px); } to { opacity:1; transform:translateY(0);} }
          .animate-form-enter { animation: slideInFromBottom 220ms cubic-bezier(.2,.9,.2,1) both; }
        `}</style>

        {mode === "quick" ? (
          <div className="flex flex-col gap-3 mt-2 animate-[slideInFromBottom_220ms_cubic-bezier(.2,.9,.2,1)_both]">
            <button
              type="button"
              className={primaryButtonClass}
              onClick={() => showToast("南京大学统一身份认证未接入")}
            >
              <span>南京大学统一认证</span>
            </button>
            <button
              type="button"
              className={primaryButtonClass}
              onClick={() => {
                window.location.href = apiUrl("/auth/github");
              }}
            >
              <GitHubIcon />
              <span>{"\u4f7f\u7528GitHub\u767b\u5f55"}</span>
            </button>
            <button
              type="button"
              className={primaryButtonClass}
              onClick={() => {
                window.location.href = apiUrl("/auth/google");
              }}
            >
              <GoogleIcon />
              <span>{"\u4f7f\u7528Google\u767b\u5f55"}</span>
            </button>

            <div className="flex items-center gap-4 my-1">
              <div className="flex-1 h-px bg-[var(--brand-muted)] opacity-30" />
              <span className="text-[var(--brand-muted)] text-sm whitespace-nowrap">
                或者
              </span>
              <div className="flex-1 h-px bg-[var(--brand-muted)] opacity-30" />
            </div>

            <button
              type="button"
              className={primaryButtonClass}
              onClick={() => setMode("password")}
            >
              <MailIcon />
              <span>邮箱或用户名登录/注册</span>
            </button>
            <button
              type="button"
              className={primaryButtonClass}
              onClick={goGuest}
            >
              <UserIcon />
              <span>以游客身份登录</span>
            </button>
          </div>
        ) : (
          <>
            <Tabs mode={mode} setMode={setMode} />
            <Form
              fields={(mode === "password"
                ? passwordFields
                : smsFields
              ).concat(navAgree)}
              onSubmit={handleSubmit}
              submitText={
                <>
                  <EnterIcon />
                  <span>登录</span>
                </>
              }
              submitClassName={primaryButtonClass}
              fieldClassName="relative [&>label]:sr-only col-span-2"
              className="flex flex-col gap-0.5"
              animateFieldsKey={mode}
            />
          </>
        )}
      </div>
    </div>
  );
}
