import Button from "@/ui/Button";

type Mode = "password" | "sms" | "quick";

export default function Tabs({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div className="mb-2 flex items-center gap-8">
      <Button
        type="button"
        onClick={() => setMode("quick")}
        className="group flex flex-col items-center text-base font-semibold"
        aria-current={mode === "quick"}
      >
        <span className={`${mode === "quick" ? "text-[var(--brand-purple)]" : "text-[var(--brand-muted)] group-hover:text-[var(--brand-blue)]"}`}>快捷登录</span>
        <div className={`mt-2 h-[3px] tab-underline bg-[var(--brand-purple)] transition-all ${mode === "quick" ? "w-full" : "w-0"}`} style={{maxWidth: '6rem'}} />
      </Button>

      <Button
        type="button"
        onClick={() => setMode("password")}
        className="group flex flex-col items-center text-base font-semibold"
        aria-current={mode === "password"}
      >
        <span className={`${mode === "password" ? "text-[var(--brand-purple)]" : "text-[var(--brand-muted)] group-hover:text-[var(--brand-blue)]"}`}>账密登录</span>
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
