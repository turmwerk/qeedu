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
import MicrosoftIcon from "@/ui/Icon/MicrosoftIcon";
import MailIcon from "@/ui/Icon/MailIcon";
import UserIcon from "@/ui/Icon/UserIcon";
import EnterIcon from "@/ui/Icon/EnterIcon";
import { apiUrl } from "@/api/config";
import { loginWithEmailCode, loginWithPassword, sendEmailCode } from "@/api/auth";
import { useCodeCountdown } from "../useCodeCountdown";
import { useTranslation } from "@/hooks/useTranslation";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"password" | "sms" | "quick">("quick");
  const [submitting, setSubmitting] = useState(false);
  const loginCode = useCodeCountdown();
  const { t } = useTranslation();

  const goGuest = () => {
    showToast(t("auth.guestToast"));
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
      showToast(`${t("auth.oauthFailed")}: ${error}`);
      return;
    }

    // Cookie is set by the backend. Verify via /me then redirect.
    fetch(apiUrl("/me"), { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then(() => {
        const label =
          provider === "github" ? "GitHub" : provider === "microsoft" ? "Microsoft" : "Google";
        showToast(t("auth.oauthSuccess", { provider: label, name: name || t("common.user") }));
        navigate("/");
      })
      .catch(() => {
        showToast(t("auth.oauthVerifyFailed"));
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
    t,
  });

  const smsFields: FormField[] = buildFields("login-sms", {
    showPassword,
    setShowPassword,
    sendButtonClass,
    codeCooldowns: { login: loginCode.cooldown },
    codeSending: { login: loginCode.sending },
    t,
    onSendCode: async (_field, email) => {
      const normalized = email.trim();
      if (!normalized) {
        showToast(t("auth.enterEmailFirst"));
        return;
      }
      await loginCode.run(async () => {
        const res = await sendEmailCode(normalized, "login");
        showToast(res.dev_code ? t("auth.codeToast", { code: res.dev_code }) : t("auth.codeAccepted"));
      }).catch((err) => {
        showToast(err instanceof Error ? err.message : t("auth.sendCodeFailed"));
      });
    },
  });

  const navAgree = createNavAgreeFields(
    navigate,
    goGuest,
    t("auth.loginAgree"),
    "login",
    t,
  );

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      if (mode === "password") {
        const account = String(values.account ?? "").trim();
        const password = String(values.password ?? "");
        if (!account || !password) {
          showToast(t("auth.fillLogin"));
          return;
        }
        await loginWithPassword(account, password);
      } else {
        const email = String(values.email ?? "").trim();
        const code = String(values.smsCode ?? "").trim();
        if (!email || !code) {
          showToast(t("auth.fillEmailCode"));
          return;
        }
        await loginWithEmailCode(email, code);
      }
      window.dispatchEvent(new Event("auth-change"));
      showToast(t("auth.loginSuccess"));
      navigate("/");
    } catch (err) {
      showToast(err instanceof Error ? err.message : t("auth.loginFailed"));
    } finally {
      setSubmitting(false);
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
          {t("auth.loginTitle")}
        </div>
        <style>{`
          @keyframes slideInFromBottom { from { opacity: 0; transform: translateY(8px); } to { opacity:1; transform:translateY(0);} }
          .animate-form-enter { animation: slideInFromBottom 220ms cubic-bezier(.2,.9,.2,1) both; }
        `}</style>

        {mode === "quick" ? (
          <div className="flex flex-col gap-3 mt-2 animate-[slideInFromBottom_220ms_cubic-bezier(.2,.9,.2,1)_both]">
            {/* 南京大学统一认证暂不实现，先隐藏入口。
            <button
              type="button"
              className={primaryButtonClass}
              onClick={() => showToast("南京大学统一身份认证未接入")}
            >
              <span>南京大学统一认证</span>
            </button>
            */}
            <button
              type="button"
              className={primaryButtonClass}
              onClick={() => {
                window.location.href = apiUrl("/auth/github");
              }}
            >
              <GitHubIcon />
              <span>{t("auth.githubLogin")}</span>
            </button>
            <button
              type="button"
              className={primaryButtonClass}
              onClick={() => {
                window.location.href = apiUrl("/auth/google");
              }}
            >
              <GoogleIcon />
              <span>{t("auth.googleLogin")}</span>
            </button>
            <button
              type="button"
              className={primaryButtonClass}
              onClick={() => {
                window.location.href = apiUrl("/auth/microsoft");
              }}
            >
              <MicrosoftIcon />
              <span>{t("auth.microsoftLogin")}</span>
            </button>

            <div className="flex items-center gap-4 my-1">
              <div className="flex-1 h-px bg-[var(--brand-muted)] opacity-30" />
              <span className="text-[var(--brand-muted)] text-sm whitespace-nowrap">
                {t("auth.or")}
              </span>
              <div className="flex-1 h-px bg-[var(--brand-muted)] opacity-30" />
            </div>

            <button
              type="button"
              className={primaryButtonClass}
              onClick={() => setMode("password")}
            >
              <MailIcon />
              <span>{t("auth.emailLoginEntry")}</span>
            </button>
            <button
              type="button"
              className={primaryButtonClass}
              onClick={goGuest}
            >
              <UserIcon />
              <span>{t("auth.guestLogin")}</span>
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
                  <span>{t("auth.loginSubmit")}</span>
                </>
              }
              submitClassName={primaryButtonClass}
              submitLoading={submitting}
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
