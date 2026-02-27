import Button from "@/components/Button";

export default function Tabs({ mode, setMode }: { mode: "password" | "sms"; setMode: (m: "password" | "sms") => void }) {
  return (
    <div className="mb-4 flex items-center gap-8">
      <Button
        type="button"
        onClick={() => setMode("password")}
        className="group flex flex-col items-center text-base font-semibold"
        aria-current={mode === "password"}
      >
        <span className={`${mode === "password" ? "text-[var(--brand-purple)]" : "text-[var(--brand-muted)] group-hover:text-[var(--brand-blue)]"}`}>账号密码登录</span>
        <div className={`mt-2 h-[3px] tab-underline bg-[var(--brand-purple)] transition-all ${mode === "password" ? "w-full" : "w-0"}`} style={{maxWidth: '6rem'}} />
      </Button>

      <Button
        type="button"
        onClick={() => setMode("sms")}
        className="group flex flex-col items-center text-base font-semibold"
        aria-current={mode === "sms"}
      >
        <span className={`${mode === "sms" ? "text-[var(--brand-purple)]" : "text-[var(--brand-muted)] group-hover:text-[var(--brand-blue)]"}`}>验证码登录</span>
        <div className={`mt-2 h-[3px] tab-underline bg-[var(--brand-purple)] transition-all ${mode === "sms" ? "w-full" : "w-0"}`} style={{maxWidth: '6rem'}} />
      </Button>
    </div>
  );
}
