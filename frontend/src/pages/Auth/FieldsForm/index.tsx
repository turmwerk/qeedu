import type { FormField } from "@/ui/Form";
import KeyIcon from "@/ui/Icon/KeyIcon";
import IdIcon from "@/ui/Icon/IdIcon";
import LockIcon from "@/ui/Icon/LockIcon";
import EyeIcon from "@/ui/Icon/EyeIcon";
import EyeTooltip from "../EyeTooltip";
import { translate } from "@/hooks/useTranslation";

// Note: Some projects may not have centralized Icon components; if so, callers can
// pass icon components. To keep compatibility with the existing pages, this module
// will build fields mimicking current structure.

export interface BuildFieldsOptions {
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  showPassword2?: boolean;
  setShowPassword2?: (v: boolean) => void;
  sendButtonClass: string;
  onSendCode?: (field: "login" | "register" | "forget", email: string) => void;
  codeCooldowns?: Partial<Record<"login" | "register" | "forget", number>>;
  codeSending?: Partial<Record<"login" | "register" | "forget", boolean>>;
  t?: typeof translate;
}

export function buildFields(kind: "login-password" | "login-sms" | "register" | "forget", opts: BuildFieldsOptions): FormField[] {
  const { showPassword, setShowPassword, showPassword2, setShowPassword2, sendButtonClass, onSendCode, codeCooldowns, codeSending } = opts;
  const t = opts.t ?? translate;
  void sendButtonClass;

  const hasValue = (value: unknown) => String(value ?? "").trim().length > 0;
  const shellClass =
    "auth-field-shell group w-full flex items-stretch box-border border transition-colors overflow-hidden relative rounded-2xl";
  const visibleShellClass = `${shellClass} overflow-visible`;
  const inputClass =
    "auth-field-input w-full h-[56px] box-border border-0 bg-transparent text-[16px] outline-none rounded-2xl appearance-none focus:placeholder-transparent";
  const renderFloatingLabel = (label: string, value: unknown) => (
    <span
      className={`auth-floating-label pointer-events-none absolute left-4 top-[6px] px-1 text-[12px] leading-none z-10 transition-all ${
        hasValue(value)
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-1 group-focus-within:opacity-100 group-focus-within:translate-y-0"
      }`}
    >
      {label}
    </span>
  );
  const renderCodeButton = (field: "login" | "register" | "forget", email: string) => {
    const cooldown = Math.max(0, Number(codeCooldowns?.[field] ?? 0));
    const sending = !!codeSending?.[field];
    const disabled = cooldown > 0 || sending;
    return (
      <button
        type="button"
        onClick={() => {
          if (!disabled) onSendCode?.(field, email);
        }}
        disabled={disabled}
        aria-disabled={disabled}
        className="auth-code-action absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brand-blue)] hover:text-[var(--brand-purple)] font-bold bg-transparent border-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:text-[var(--brand-blue)]"
      >
        {sending ? t("auth.sending") : cooldown > 0 ? t("auth.retryAfter", { seconds: String(cooldown) }) : t("auth.getCode")}
      </button>
    );
  };

  if (kind === "login-password") {
    const fields: FormField[] = [
      {
        name: "account",
        label: t("auth.account"),
        placeholder: t("auth.accountPlaceholder"),
        render: (value, onChange) => (
          <div className={shellClass}>
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <IdIcon />
            </div>
            {renderFloatingLabel(t("auth.account"), value)}
            <input className={`${inputClass} pl-[56px] pr-4`} id="login-account" name="account" value={value} onChange={(e) => onChange(e.target.value)} placeholder={t("auth.accountPlaceholder")} />
          </div>
        ),
      },
      {
        name: "password",
        label: t("auth.password"),
        placeholder: t("auth.password"),
        render: (value, onChange) => (
          <div className={visibleShellClass}>
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <LockIcon />
            </div>
            {renderFloatingLabel(t("auth.password"), value)}
            <input className={`${inputClass} pl-[56px] pr-[56px]`} id="login-password" name="password" type={showPassword ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={t("auth.password")} autoComplete="current-password" />

            <EyeTooltip on={showPassword} onToggle={() => setShowPassword(!showPassword)} ariaLabel={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}>
              <EyeIcon on={showPassword} />
            </EyeTooltip>
          </div>
        ),
      },
    ];

    return fields;
  }

  if (kind === "login-sms") {
    const fields: FormField[] = [
      {
        name: "email",
        label: t("auth.email"),
        placeholder: t("auth.email"),
        render: (value, onChange) => (
          <div className={shellClass}>
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <IdIcon />
            </div>
            {renderFloatingLabel(t("auth.email"), value)}
            <input className={`${inputClass} pl-[56px] pr-4`} id="login-email" name="email" value={value} onChange={(e) => onChange(e.target.value)} placeholder={t("auth.email")} inputMode="email" />
          </div>
        ),
      },
      {
        name: "smsCode",
        label: t("auth.code"),
        placeholder: t("auth.code"),
        render: (value, onChange, values) => (
          <div className={shellClass}>
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none z-10">
              <KeyIcon />
            </div>
            {renderFloatingLabel(t("auth.code"), value)}
            <input className={`${inputClass} flex-1 pl-[56px] pr-[110px]`} id="login-sms-code" name="smsCode" value={value} onChange={(e) => onChange(e.target.value)} placeholder={t("auth.code")} autoComplete="one-time-code" />

            {renderCodeButton("login", String(values.email ?? ""))}
          </div>
        ),
      },
    ];

    return fields;
  }

  if (kind === "register" || kind === "forget") {
    const idName = kind === "register" ? "email" : "email";
    const codeName = kind === "register" ? "emailCode" : "emailCode";

    const fields: FormField[] = [
      {
        name: idName,
        label: t("auth.email"),
        placeholder: t("auth.email"),
        render: (value, onChange) => (
          <div className={shellClass}>
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <IdIcon />
            </div>
            {renderFloatingLabel(t("auth.email"), value)}
            <input className={`${inputClass} pl-[56px] pr-4`} id={`${kind}-${idName}`} name={idName} value={value} onChange={(e) => onChange(e.target.value)} placeholder={t("auth.email")} />
          </div>
        ),
      },
      ...(kind === "register"
        ? [
            {
              name: "name",
              label: t("auth.username"),
              placeholder: t("auth.username"),
              render: (value, onChange) => (
                <div className={shellClass}>
                  <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
                    <IdIcon />
                  </div>
                  {renderFloatingLabel(t("auth.username"), value)}
                  <input className={`${inputClass} pl-[56px] pr-4`} id="register-name" name="name" value={value} onChange={(e) => onChange(e.target.value)} placeholder={t("auth.username")} autoComplete="username" maxLength={30} />
                </div>
              ),
            } satisfies FormField,
          ]
        : []),
      {
        name: codeName,
        label: t("auth.code"),
        placeholder: t("auth.code"),
        render: (value, onChange, values) => (
          <div className={shellClass}>
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none z-10">
              <KeyIcon />
            </div>
            {renderFloatingLabel(t("auth.code"), value)}
            <input className={`${inputClass} flex-1 pl-[56px] pr-[110px]`} id={`${kind}-${codeName}`} name={codeName} value={value} onChange={(e) => onChange(e.target.value)} placeholder={t("auth.code")} autoComplete="one-time-code" />

            {renderCodeButton(kind, String(values.email ?? ""))}
          </div>
        ),
      },
      {
        name: "password",
        label: t("auth.password"),
        placeholder: t("auth.password"),
        render: (value, onChange) => (
          <div className={visibleShellClass}>
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <LockIcon />
            </div>
            {renderFloatingLabel(t("auth.password"), value)}
            <input className={`${inputClass} pl-[56px] pr-[56px]`} id={`${kind}-password`} name="password" type={showPassword ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={t("auth.password")} autoComplete="new-password" />

            <EyeTooltip on={showPassword} onToggle={() => setShowPassword(!showPassword)} ariaLabel={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}>
              <EyeIcon on={showPassword} />
            </EyeTooltip>
          </div>
        ),
      },
      {
        name: "password2",
        label: t("auth.confirmPassword"),
        placeholder: t("auth.confirmPassword"),
        render: (value, onChange) => (
          <div className={visibleShellClass}>
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <LockIcon />
            </div>
            {renderFloatingLabel(t("auth.confirmPassword"), value)}
            <input className={`${inputClass} pl-[56px] pr-[56px]`} id={`${kind}-password-confirm`} name="password2" type={showPassword2 ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={t("auth.confirmPassword")} autoComplete="new-password" />

            <EyeTooltip on={!!showPassword2} onToggle={() => setShowPassword2 && setShowPassword2(!showPassword2)} ariaLabel={showPassword2 ? t("auth.hidePassword") : t("auth.showPassword")}>
              <EyeIcon on={!!showPassword2} />
            </EyeTooltip>
          </div>
        ),
      },
    ];

    return fields;
  }

  return [];
}

export default buildFields;
