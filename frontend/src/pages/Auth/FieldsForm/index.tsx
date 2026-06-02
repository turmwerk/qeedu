import type { FormField } from "@/ui/Form";
import { showToast } from "@/ui/Toast";
import KeyIcon from "@/ui/Icon/KeyIcon";
import IdIcon from "@/ui/Icon/IdIcon";
import LockIcon from "@/ui/Icon/LockIcon";
import EyeIcon from "@/ui/Icon/EyeIcon";
import EyeTooltip from "../EyeTooltip";

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
}

export function buildFields(kind: "login-password" | "login-sms" | "register" | "forget", opts: BuildFieldsOptions): FormField[] {
  const { showPassword, setShowPassword, showPassword2, setShowPassword2, sendButtonClass, onSendCode } = opts;
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

  if (kind === "login-password") {
    const fields: FormField[] = [
      {
        name: "account",
        label: "用户名/邮箱",
        placeholder: "用户名、邮箱",
        render: (value, onChange) => (
          <div className={shellClass}>
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <IdIcon />
            </div>
            {renderFloatingLabel("用户名/邮箱", value)}
            <input className={`${inputClass} pl-[56px] pr-4`} id="login-account" name="account" value={value} onChange={(e) => onChange(e.target.value)} placeholder="用户名、邮箱" />
          </div>
        ),
      },
      {
        name: "password",
        label: "密码",
        placeholder: "密码",
        render: (value, onChange) => (
          <div className={visibleShellClass}>
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <LockIcon />
            </div>
            {renderFloatingLabel("密码", value)}
            <input className={`${inputClass} pl-[56px] pr-[56px]`} id="login-password" name="password" type={showPassword ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder="密码" autoComplete="current-password" />

            <EyeTooltip on={showPassword} onToggle={() => setShowPassword(!showPassword)} ariaLabel={showPassword ? "隐藏密码" : "显示密码"}>
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
        label: "邮箱",
        placeholder: "邮箱",
        render: (value, onChange) => (
          <div className={shellClass}>
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <IdIcon />
            </div>
            {renderFloatingLabel("  邮箱", value)}
            <input className={`${inputClass} pl-[56px] pr-4`} id="login-email" name="email" value={value} onChange={(e) => onChange(e.target.value)} placeholder="邮箱" inputMode="email" />
          </div>
        ),
      },
      {
        name: "smsCode",
        label: "验证码",
        placeholder: "验证码",
        render: (value, onChange, values) => (
          <div className={shellClass}>
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none z-10">
              <KeyIcon />
            </div>
            {renderFloatingLabel("验证码", value)}
            <input className={`${inputClass} flex-1 pl-[56px] pr-[110px]`} id="login-sms-code" name="smsCode" value={value} onChange={(e) => onChange(e.target.value)} placeholder="验证码" autoComplete="one-time-code" />

            <button type="button" onClick={() => onSendCode ? onSendCode("login", String(values.email ?? "")) : showToast("验证码发送未实现")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brand-blue)] hover:text-[var(--brand-purple)] font-bold bg-transparent border-0">
              获取验证码
            </button>
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
        label: "邮箱",
        placeholder: "邮箱",
        render: (value, onChange) => (
          <div className={shellClass}>
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <IdIcon />
            </div>
            {renderFloatingLabel("邮箱", value)}
            <input className={`${inputClass} pl-[56px] pr-4`} id={`${kind}-${idName}`} name={idName} value={value} onChange={(e) => onChange(e.target.value)} placeholder="邮箱" />
          </div>
        ),
      },
      {
        name: codeName,
        label: "验证码",
        placeholder: "验证码",
        render: (value, onChange, values) => (
          <div className={shellClass}>
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none z-10">
              <KeyIcon />
            </div>
            {renderFloatingLabel("验证码", value)}
            <input className={`${inputClass} flex-1 pl-[56px] pr-[110px]`} id={`${kind}-${codeName}`} name={codeName} value={value} onChange={(e) => onChange(e.target.value)} placeholder="验证码" autoComplete="one-time-code" />

            <button type="button" onClick={() => onSendCode ? onSendCode(kind, String(values.email ?? "")) : showToast("验证码发送未实现")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brand-blue)] hover:text-[var(--brand-purple)] font-bold bg-transparent border-0">
              获取验证码
            </button>
          </div>
        ),
      },
      {
        name: "password",
        label: "密码",
        placeholder: "密码",
        render: (value, onChange) => (
          <div className={visibleShellClass}>
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <LockIcon />
            </div>
            {renderFloatingLabel("密码", value)}
            <input className={`${inputClass} pl-[56px] pr-[56px]`} id={`${kind}-password`} name="password" type={showPassword ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder="密码" autoComplete="new-password" />

            <EyeTooltip on={showPassword} onToggle={() => setShowPassword(!showPassword)} ariaLabel={showPassword ? "隐藏密码" : "显示密码"}>
              <EyeIcon on={showPassword} />
            </EyeTooltip>
          </div>
        ),
      },
      {
        name: "password2",
        label: "再次输入密码",
        placeholder: "再次输入密码",
        render: (value, onChange) => (
          <div className={visibleShellClass}>
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <LockIcon />
            </div>
            {renderFloatingLabel("再次输入密码", value)}
            <input className={`${inputClass} pl-[56px] pr-[56px]`} id={`${kind}-password-confirm`} name="password2" type={showPassword2 ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder="再次输入密码" autoComplete="new-password" />

            <EyeTooltip on={!!showPassword2} onToggle={() => setShowPassword2 && setShowPassword2(!showPassword2)} ariaLabel={showPassword2 ? "隐藏密码" : "显示密码"}>
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
