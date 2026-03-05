import type { FormField } from "@/components/Form";
import { showToast } from "@/components/Toast";
import KeyIcon from "../../../../components/Icon/KeyIcon";
import IdIcon from "../../../../components/Icon/IdIcon";
import LockIcon from "../../../../components/Icon/LockIcon";
import EyeIcon from "../../../../components/Icon/EyeIcon";
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
}

export function buildFields(kind: "login-password" | "login-sms" | "register" | "forget", opts: BuildFieldsOptions): FormField[] {
  const { showPassword, setShowPassword, showPassword2, setShowPassword2, sendButtonClass } = opts;
  void sendButtonClass;

  const hasValue = (value: unknown) => String(value ?? "").trim().length > 0;
  const renderFloatingLabel = (label: string, value: unknown) => (
    <span
      className={`pointer-events-none absolute left-4 top-[6px] px-1 bg-white text-[12px] leading-none z-10 transition-all ${
        hasValue(value)
          ? "opacity-100 translate-y-0 text-[var(--brand-text)]"
          : "opacity-0 translate-y-1 text-[var(--brand-text)] group-focus-within:opacity-100 group-focus-within:translate-y-0"
      }`}
    >
      {label}
    </span>
  );

  if (kind === "login-password") {
    const fields: FormField[] = [
      {
        name: "account",
        label: "用户名/邮箱/手机号",
        placeholder: "用户名、邮箱或手机号",
        render: (value, onChange) => (
          <div className="group w-full flex items-stretch box-border border border-[var(--brand-blue)] hover:border-[var(--brand-purple)] focus-within:border-[var(--brand-purple)] transition-colors bg-white overflow-hidden relative rounded-2xl">
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <IdIcon />
            </div>
            {renderFloatingLabel("用户名/邮箱/手机号", value)}
            <input className="auth-field-input w-full h-[56px] pl-[56px] pr-4 box-border border-0 bg-transparent text-[16px] outline-none rounded-2xl appearance-none placeholder:text-[var(--brand-muted)] focus:placeholder-transparent" id="login-account" name="account" value={value} onChange={(e) => onChange(e.target.value)} placeholder="用户名、邮箱或手机号" />
          </div>
        ),
      },
      {
        name: "password",
        label: "密码",
        placeholder: "密码",
        render: (value, onChange) => (
          <div className="group w-full flex items-stretch box-border border border-[var(--brand-blue)] hover:border-[var(--brand-purple)] focus-within:border-[var(--brand-purple)] transition-colors bg-white overflow-visible relative rounded-2xl">
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <LockIcon />
            </div>
            {renderFloatingLabel("密码", value)}
            <input className="auth-field-input h-[56px] w-full pl-[56px] pr-[56px] box-border border-0 bg-transparent text-[16px] outline-none rounded-2xl appearance-none placeholder:text-[var(--brand-muted)] focus:placeholder-transparent" id="login-password" name="password" type={showPassword ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder="密码" autoComplete="current-password" />

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
        name: "phone",
        label: "手机号/邮箱",
        placeholder: "手机号或邮箱",
        render: (value, onChange) => (
          <div className="group w-full flex items-stretch box-border border border-[var(--brand-blue)] hover:border-[var(--brand-purple)] focus-within:border-[var(--brand-purple)] transition-colors bg-white overflow-hidden relative rounded-2xl">
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <IdIcon />
            </div>
            {renderFloatingLabel("手机号/邮箱", value)}
            <input className="auth-field-input w-full h-[56px] pl-[56px] pr-4 box-border border-0 bg-transparent text-[16px] outline-none rounded-2xl appearance-none placeholder:text-[var(--brand-muted)] focus:placeholder-transparent" id="login-phone" name="phone" value={value} onChange={(e) => onChange(e.target.value)} placeholder="手机号或邮箱" inputMode="tel" />
          </div>
        ),
      },
      {
        name: "smsCode",
        label: "验证码",
        placeholder: "验证码",
        render: (value, onChange) => (
          <div className="group w-full flex items-stretch box-border border border-[var(--brand-blue)] hover:border-[var(--brand-purple)] focus-within:border-[var(--brand-purple)] transition-colors bg-white overflow-hidden relative rounded-2xl">
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none z-10">
              <KeyIcon />
            </div>
            {renderFloatingLabel("验证码", value)}
            <input className="auth-field-input h-[56px] flex-1 w-full pl-[56px] pr-[110px] box-border border-0 bg-transparent text-[16px] outline-none rounded-2xl appearance-none placeholder:text-[var(--brand-muted)] focus:placeholder-transparent" id="login-sms-code" name="smsCode" value={value} onChange={(e) => onChange(e.target.value)} placeholder="验证码" autoComplete="one-time-code" />

            <button type="button" onClick={() => showToast("验证码发送未实现")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brand-blue)] hover:text-[var(--brand-purple)] font-bold bg-transparent border-0">
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
        label: "邮箱/手机号",
        placeholder: "邮箱或手机号",
        render: (value, onChange) => (
          <div className="group w-full flex items-stretch box-border border border-[var(--brand-blue)] bg-white overflow-hidden relative rounded-2xl">
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <IdIcon />
            </div>
            {renderFloatingLabel("邮箱/手机号", value)}
            <input className="auth-field-input w-full h-[56px] pl-[56px] pr-4 box-border border-0 bg-transparent text-[16px] outline-none rounded-2xl appearance-none placeholder:text-[var(--brand-muted)] focus:placeholder-transparent" id={`${kind}-${idName}`} name={idName} value={value} onChange={(e) => onChange(e.target.value)} placeholder="邮箱或手机号" />
          </div>
        ),
      },
      {
        name: codeName,
        label: "验证码",
        placeholder: "验证码",
        render: (value, onChange) => (
          <div className="group w-full flex items-stretch box-border border border-[var(--brand-blue)] bg-white overflow-hidden relative rounded-2xl">
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none z-10">
              <KeyIcon />
            </div>
            {renderFloatingLabel("验证码", value)}
            <input className="auth-field-input h-[56px] flex-1 w-full pl-[56px] pr-[110px] box-border border-0 bg-transparent text-[16px] outline-none rounded-2xl appearance-none placeholder:text-[var(--brand-muted)] focus:placeholder-transparent" id={`${kind}-${codeName}`} name={codeName} value={value} onChange={(e) => onChange(e.target.value)} placeholder="验证码" autoComplete="one-time-code" />

            <button type="button" onClick={() => showToast("验证码发送未实现")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brand-blue)] hover:text-[var(--brand-purple)] font-bold bg-transparent border-0">
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
          <div className="group w-full flex items-stretch box-border border border-[var(--brand-blue)] hover:border-[var(--brand-purple)] focus-within:border-[var(--brand-purple)] transition-colors bg-white overflow-visible relative rounded-2xl">
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <LockIcon />
            </div>
            {renderFloatingLabel("密码", value)}
            <input className="auth-field-input h-[56px] w-full pl-[56px] pr-[56px] box-border border-0 bg-transparent text-[16px] outline-none rounded-2xl appearance-none placeholder:text-[var(--brand-muted)] focus:placeholder-transparent" id={`${kind}-password`} name="password" type={showPassword ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder="密码" autoComplete="new-password" />

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
          <div className="group w-full flex items-stretch box-border border border-[var(--brand-blue)] hover:border-[var(--brand-purple)] focus-within:border-[var(--brand-purple)] transition-colors bg-white overflow-visible relative rounded-2xl">
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <LockIcon />
            </div>
            {renderFloatingLabel("再次输入密码", value)}
            <input className="auth-field-input h-[56px] w-full pl-[56px] pr-[56px] box-border border-0 bg-transparent text-[16px] outline-none rounded-2xl appearance-none placeholder:text-[var(--brand-muted)] focus:placeholder-transparent" id={`${kind}-password-confirm`} name="password2" type={showPassword2 ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder="再次输入密码" autoComplete="new-password" />

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
