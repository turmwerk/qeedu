import Button from "@/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";

type Mode = "password" | "sms" | "quick";

export default function Tabs({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  const { t } = useTranslation();
  const items: Array<{ mode: Mode; label: string }> = [
    { mode: "quick", label: t("auth.quickLogin") },
    { mode: "password", label: t("auth.passwordLogin") },
    { mode: "sms", label: t("auth.codeLogin") },
  ];

  return (
    <div className="mb-2 flex items-center gap-8">
      {items.map((item) => (
        <Button
          key={item.mode}
          type="button"
          onClick={() => setMode(item.mode)}
          className="group flex flex-col items-center text-base font-semibold"
          aria-current={mode === item.mode}
        >
          <span className={mode === item.mode ? "text-[var(--brand-purple)]" : "text-[var(--brand-muted)] group-hover:text-[var(--brand-blue)]"}>
            {item.label}
          </span>
          <div
            className={`mt-2 h-[3px] tab-underline bg-[var(--brand-purple)] transition-all ${mode === item.mode ? "w-full" : "w-0"}`}
            style={{ maxWidth: "6rem" }}
          />
        </Button>
      ))}
    </div>
  );
}
