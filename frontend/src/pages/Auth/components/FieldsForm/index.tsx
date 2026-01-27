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

  if (kind === "login-password") {
    const fields: FormField[] = [
      {
        name: "account",
        label: "用户名/邮箱/手机号",
        placeholder: "用户名、邮箱或手机号",
        render: (value, onChange) => (
          <div className="w-full flex items-stretch box-border border border-blue-600 hover:border-[#6d28d9] focus-within:border-[#6d28d9] transition-colors bg-white overflow-hidden relative">
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <IdIcon />
            </div>
            <input className="w-full h-[56px] pl-[56px] pr-4 box-border border-0 bg-transparent text-[16px] outline-none" id="login-account" name="account" value={value} onChange={(e) => onChange(e.target.value)} placeholder="用户名、邮箱或手机号" />
          </div>
        ),
      },
      {
        name: "password",
        label: "密码",
        placeholder: "密码",
        render: (value, onChange) => (
          <div className="w-full flex items-stretch box-border border border-blue-600 hover:border-[#6d28d9] focus-within:border-[#6d28d9] transition-colors bg-white overflow-visible relative">
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <LockIcon />
            </div>
            <input className="h-[56px] w-full pl-[56px] pr-[56px] box-border border-0 bg-transparent text-[16px] outline-none" id="login-password" name="password" type={showPassword ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder="密码" autoComplete="current-password" />

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
          <div className="w-full flex items-stretch box-border border border-blue-600 hover:border-[#6d28d9] focus-within:border-[#6d28d9] transition-colors bg-white overflow-hidden relative">
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <IdIcon />
            </div>
            <input className="w-full h-[56px] pl-[56px] pr-4 box-border border-0 bg-transparent text-[16px] outline-none" id="login-phone" name="phone" value={value} onChange={(e) => onChange(e.target.value)} placeholder="手机号或邮箱" inputMode="tel" />
          </div>
        ),
      },
      {
        name: "smsCode",
        label: "验证码",
        placeholder: "验证码",
        render: (value, onChange) => (
          <div className="w-full flex items-stretch box-border border border-blue-600 hover:border-[#6d28d9] focus-within:border-[#6d28d9] transition-colors bg-white overflow-hidden relative">
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none z-10">
              <KeyIcon />
            </div>
            <input className="h-[56px] flex-1 w-full pl-[56px] pr-[110px] box-border border-0 bg-transparent text-[16px] outline-none" id="login-sms-code" name="smsCode" value={value} onChange={(e) => onChange(e.target.value)} placeholder="验证码" autoComplete="one-time-code" />

            <button type="button" onClick={() => showToast("验证码发送未实现")} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-[#6d28d9] font-bold bg-transparent border-0">
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
          <div className="w-full flex items-stretch box-border border border-blue-600 bg-white overflow-hidden relative">
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <IdIcon />
            </div>
            <input className="w-full h-[56px] pl-[56px] pr-4 box-border border-0 bg-transparent text-[16px] outline-none" id={`${kind}-${idName}`} name={idName} value={value} onChange={(e) => onChange(e.target.value)} placeholder="邮箱或手机号" />
          </div>
        ),
      },
      {
        name: codeName,
        label: "验证码",
        placeholder: "验证码",
        render: (value, onChange) => (
          <div className="w-full flex items-stretch box-border border border-blue-600 bg-white overflow-hidden relative">
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none z-10">
              <KeyIcon />
            </div>
            <input className="h-[56px] flex-1 w-full pl-[56px] pr-[110px] box-border border-0 bg-transparent text-[16px] outline-none" id={`${kind}-${codeName}`} name={codeName} value={value} onChange={(e) => onChange(e.target.value)} placeholder="验证码" autoComplete="one-time-code" />

            <button type="button" onClick={() => showToast("验证码发送未实现")} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-[#6d28d9] font-bold bg-transparent border-0">
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
          <div className="w-full flex items-stretch box-border border border-blue-600 hover:border-[#6d28d9] focus-within:border-[#6d28d9] transition-colors bg-white overflow-visible relative">
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <LockIcon />
            </div>
            <input className="h-[56px] w-full pl-[56px] pr-[56px] box-border border-0 bg-transparent text-[16px] outline-none" id={`${kind}-password`} name="password" type={showPassword ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder="密码" autoComplete="new-password" />

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
          <div className="w-full flex items-stretch box-border border border-blue-600 hover:border-[#6d28d9] focus-within:border-[#6d28d9] transition-colors bg-white overflow-visible relative">
            <div className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none">
              <LockIcon />
            </div>
            <input className="h-[56px] w-full pl-[56px] pr-[56px] box-border border-0 bg-transparent text-[16px] outline-none" id={`${kind}-password-confirm`} name="password2" type={showPassword2 ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder="再次输入密码" autoComplete="new-password" />

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
