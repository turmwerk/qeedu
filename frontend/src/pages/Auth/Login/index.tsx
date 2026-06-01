import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Form from "@/ui/Form";
import { showToast } from "@/ui/Toast";
import type { FormField } from "@/ui/Form";
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
    showToast("使用\"游客模式\"进入首页");
    navigate("/");
  };

  /* Handle OAuth result from backend redirect — JWT is now httpOnly cookie. */
  useEffect(() => {
    const provider = searchParams.get("oauth_provider");
    const error = searchParams.get("oauth_error");
    const name = searchParams.get("oauth_name");

    if (!provider && !error) return;

    setSearchParams({}, { replace: true });

    if (error) {
      showToast(`OAuth 登录失败: ${error}`);
      return;
    }

    // Cookie is set by the backend. Verify via /me then redirect.
    fetch(apiUrl("/me"), { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then(() => {
        const label = provider === "github" ? "GitHub" : "Google";
        showToast(`${label} 登录成功，欢迎 ${name || "用户"}`);
        navigate("/");
      })
      .catch(() => {
        showToast("OAuth 登录失败：身份验证失败");
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Form fields */
  const primaryButtonClass =
    "auth-primary-action w-full h-[56px] flex items-center justify-center gap-2 text-[16px] font-semibold rounded-xl transition-[background,border-color,color,transform] active:scale-95";

  const sendButtonClass =
    "auth-primary-action h-[56px] min-w-[96px] px-[18px] box-border text-[16px] font-semibold active:scale-95";

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
      showToast("账密登录未接入，使用\"游客模式\"进入首页");
    } else {
      showToast("验证码登录未接入，使用\"游客模式\"进入首页");
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
              <span>使用GitHub登录</span>
            </button>
            <button
              type="button"
              className={primaryButtonClass}
              onClick={() => {
                window.location.href = apiUrl("/auth/google");
              }}
            >
              <GoogleIcon />
              <span>使用Google登录</span>
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
