import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "@/components/Form";
import { showToast } from "@/components/Toast";
import type { FormField } from "@/components/Form";
import Button from "@/components/Button";

function EmailIcon() {
  return (
    <svg
      className="block"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      data-oid="pz1xabt"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
        data-oid="yexhngw"
      />

      <path
        d="M3 7l9 6 9-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        data-oid="ox5c:r9"
      />
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
      data-oid="-az0.q3"
    >
      <circle
        cx="8"
        cy="15"
        r="4"
        stroke="currentColor"
        strokeWidth="1.8"
        data-oid=".atqg8x"
      />

      <path
        d="M11.5 12.5l9-9M16 8l1.5-1.5M19 11l1.5-1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        data-oid="jajlc7b"
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
      data-oid="7uava.y"
    >
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
        data-oid="s.fnifq"
      />

      <path
        d="M8 11V7a4 4 0 0 1 8 0v4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        data-oid="8imar2s"
      />
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
      data-oid="rm3.6x_"
    >
      {on ? (
        <>
          <path
            d="M2.2 12c1.9-4.7 5.4-7.5 9.8-7.5S19.9 7.3 21.8 12c-1.9 4.7-5.4 7.5-9.8 7.5S4.1 16.7 2.2 12Z"
            stroke="currentColor"
            strokeWidth="1.8"
            data-oid="f99asfr"
          />

          <path
            d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
            stroke="currentColor"
            strokeWidth="1.8"
            data-oid="fhsov0k"
          />
        </>
      ) : (
        <>
          <path
            d="M3 12c2.1-4.7 5.6-7.5 9-7.5 3.4 0 6.9 2.8 9 7.5-2.1 4.7-5.6 7.5-9 7.5-3.4 0-6.9-2.8-9-7.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            data-oid="ec8y629"
          />

          <path
            d="M4 4l16 16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            data-oid="09lju9v"
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
      data-oid="u.xo40_"
    >
      <path
        d="M4 12h10"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        data-oid="tz:dxy:"
      />

      <path
        d="M11 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        data-oid="hvmxeo0"
      />

      <path
        d="M20 4h-4M20 4v16M20 20h-4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        data-oid="kisukow"
      />
    </svg>
  );
}

export default function Resister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const goGuest = () => {
    showToast("使用“游客模式”进入首页");
    navigate("/");
  };

  const fields: FormField[] = [
    {
      name: "email",
      label: "邮箱",
      placeholder: "邮箱",
      render: (value, onChange) => (
        <div
          className="w-full flex items-stretch box-border border border-[var(--brand-border)] bg-white overflow-hidden relative"
          data-oid="cgngm3l"
        >
          <div
            className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none"
            data-oid="ulethtc"
          >
            <EmailIcon data-oid="i36asrq" />
          </div>
          <input
            className="w-full h-[56px] pl-[56px] pr-4 box-border border-0 bg-transparent text-[16px] outline-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="邮箱"
            data-oid="3keljrb"
          />
        </div>
      ),
    },
    {
      name: "emailCode",
      label: "邮箱验证码",
      placeholder: "邮箱验证码",
      render: (value, onChange) => (
        <div
          className="w-full flex items-stretch box-border border border-[var(--brand-border)] bg-white overflow-hidden relative"
          data-oid="0gz.p8p"
        >
          <div
            className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none z-10"
            data-oid="h1ic:wi"
          >
            <KeyIcon data-oid="ua0ofky" />
          </div>
          <input
            className="h-[56px] flex-1 w-full pl-[56px] pr-[110px] box-border border-0 bg-transparent text-[16px] outline-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="邮箱验证码"
            autoComplete="one-time-code"
            data-oid="gp087c6"
          />

          <Button
            type="button"
            className={sendButtonClass}
            onClick={() => showToast("验证码发送未实现")}
            data-oid="c860_1o"
          >
            发送
          </Button>
        </div>
      ),
    },
    {
      name: "password",
      label: "密码",
      placeholder: "密码",
      render: (value, onChange) => (
        <div
          className="w-full flex items-stretch box-border border border-[var(--brand-border)] bg-white overflow-hidden relative"
          data-oid="yhovq6e"
        >
          <div
            className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none"
            data-oid="3ygbfie"
          >
            <LockIcon data-oid="f.p.2sn" />
          </div>
          <input
            className="h-[56px] w-full pl-[56px] pr-[56px] box-border border-0 bg-transparent text-[16px] outline-none"
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="密码"
            autoComplete="new-password"
            data-oid="8n_06g6"
          />

          <Button
            type="button"
            className="absolute right-0 top-0 border-0 bg-transparent text-[var(--brand-muted)] w-[56px] h-[56px] p-0 inline-flex items-center justify-center box-border shadow-none outline-none leading-none"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "隐藏密码" : "显示密码"}
            data-oid="n6tvm06"
          >
            <EyeIcon on={showPassword} data-oid="-nnyyp." />
          </Button>
        </div>
      ),
    },
    {
      name: "password2",
      label: "再次输入密码",
      placeholder: "再次输入密码",
      render: (value, onChange) => (
        <div
          className="w-full flex items-stretch box-border border border-[var(--brand-border)] bg-white overflow-hidden relative"
          data-oid="hkpjtmk"
        >
          <div
            className="absolute left-0 top-0 w-[56px] h-[56px] flex items-center justify-center text-[var(--brand-muted)] pointer-events-none"
            data-oid="--p99_p"
          >
            <LockIcon data-oid="ch_vh-t" />
          </div>
          <input
            className="h-[56px] w-full pl-[56px] pr-[56px] box-border border-0 bg-transparent text-[16px] outline-none"
            type={showPassword2 ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="再次输入密码"
            autoComplete="new-password"
            data-oid="j6-:3ie"
          />

          <Button
            type="button"
            className="absolute right-0 top-0 border-0 bg-transparent text-[var(--brand-muted)] w-[56px] h-[56px] p-0 inline-flex items-center justify-center box-border shadow-none outline-none leading-none"
            onClick={() => setShowPassword2((v) => !v)}
            aria-label={showPassword2 ? "隐藏密码" : "显示密码"}
            data-oid="570ah99"
          >
            <EyeIcon on={showPassword2} data-oid="8boa4sf" />
          </Button>
        </div>
      ),
    },
  ];

  const handleSubmit = (values: Record<string, unknown>) => {
    console.log("register", values);
    showToast("注册未实现");
  };

  const primaryButtonClass =
    "w-full h-[56px] bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe] text-[18px] font-extrabold cursor-pointer shadow-[0_10px_25px_rgba(59,130,246,0.2)] transition-[background,box-shadow,transform] flex items-center justify-center gap-3.5 hover:bg-[#dbeafe] hover:shadow-[0_12px_28px_rgba(59,130,246,0.28)] hover:-translate-y-[1px]";
  const smallButtonBase =
    "px-3 py-1.5 rounded-full text-[15px] font-semibold border transition-[background,border-color,box-shadow,transform] hover:-translate-y-[1px]";
  const smallPrimaryButton =
    `${smallButtonBase} bg-white text-[#1d4ed8] border-[#bfdbfe] hover:bg-[#eff6ff] hover:shadow-[0_8px_18px_rgba(59,130,246,0.2)]`;
  const smallNeutralButton =
    `${smallButtonBase} bg-white text-[#475569] border-[var(--brand-border)] hover:shadow-[0_8px_18px_rgba(15,23,42,0.12)]`;
  const sendButtonClass =
    "h-[56px] min-w-[96px] px-[18px] box-border border-l border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8] text-[16px] font-bold hover:bg-[#dbeafe]";

  return (
    <div
      className="w-[520px] max-w-[calc(100%-40px)] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.12)] px-[22px] pt-[22px] pb-[18px] relative"
      data-oid="j48j102"
    >
      <div className="py-3 pb-1.5 text-center" data-oid="6pkt29u">
        <div
          className="text-[44px] leading-[1.05] font-extrabold text-[var(--brand-text)] tracking-[0.02em]"
          data-oid="630y7kg"
        >
          nju-edu-ai
        </div>
      </div>
      <div className="px-[26px] pt-[18px] pb-[10px]" data-oid="sxw10y7">
        <Form
          fields={fields}
          onSubmit={handleSubmit}
          submitText={
            <>
              <EnterIcon data-oid="sojo3:7" />
              <span data-oid=".iab:ea">注册</span>
            </>
          }
          submitClassName={primaryButtonClass}
          fieldClassName="relative [&>label]:sr-only"
          className="flex flex-col gap-3.5"
          data-oid="nk485g0"
        />
      </div>

      <div
        className="px-[26px] pt-1.5 flex justify-between items-center"
        data-oid="cxq2m32"
      >
        <div className="inline-flex gap-3 items-center" data-oid="7hn9b5q">
          <Button
            className={smallPrimaryButton}
            onClick={() => navigate("/login")}
            data-oid="81t8x7t"
          >
            返回登录
          </Button>
        </div>

        <div className="inline-flex items-center" data-oid="tjqg5f6">
          <Button
            className={smallNeutralButton}
            onClick={goGuest}
            data-oid="rveoy0u"
          >
            游客模式
          </Button>
        </div>
      </div>
    </div>
  );
}
