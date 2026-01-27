import Button from "@/components/Button";

export default function Tabs({ mode, setMode }: { mode: "password" | "sms"; setMode: (m: "password" | "sms") => void }) {
  return (
    <div className="mb-4 flex items-center gap-8">
      <Button
        type="button"
        onClick={() => setMode("password")}
        className="group flex flex-col items-center text-base font-semibold text-[rgba(0,0,0,0.65)]"
        aria-current={mode === "password"}
      >
        <span className={`${mode === "password" ? "text-[#6d28d9]" : "text-[rgba(0,0,0,0.45)] group-hover:text-blue-600"}`}>账密登录</span>
        <div className={`mt-2 h-[3px] bg-[#6d28d9] transition-all ${mode === "password" ? "w-full" : "w-0"}`} style={{maxWidth: '6rem'}} />
      </Button>

      <Button
        type="button"
        onClick={() => setMode("sms")}
        className="group flex flex-col items-center text-base font-semibold text-[rgba(0,0,0,0.65)]"
        aria-current={mode === "sms"}
      >
        <span className={`${mode === "sms" ? "text-[#6d28d9]" : "text-[rgba(0,0,0,0.45)] group-hover:text-blue-600"}`}>验证码登录</span>
        <div className={`mt-2 h-[3px] bg-[#6d28d9] transition-all ${mode === "sms" ? "w-full" : "w-0"}`} style={{maxWidth: '6rem'}} />
      </Button>
    </div>
  );
}
