import type { FormField } from "@/ui/Form";
import { translate } from "@/hooks/useTranslation";

export function createNavAgreeFields(
  navigate: (path: string) => void,
  goGuest: () => void,
  agreeText = "登录即代表您已阅读并同意",
  page: "login" | "register" | "forget" = "login",
  t: typeof translate = translate,
) {
  const navField: FormField = {
    name: "nav",
    label: "",
    span: 2,
    render: () => (
      <div className="flex items-center justify-between w-full">
        <div className="inline-flex gap-1 items-center">
          {page === "login" ? (
            <>
              <span onClick={() => navigate("/register")} className="text-[var(--brand-blue)] cursor-pointer hover:underline hover:text-[var(--brand-purple)]">
                {t("auth.register")}
              </span>
              <span className="text-[var(--brand-muted)]">|</span>
              <span onClick={() => navigate("/forget-password")} className="text-[var(--brand-blue)] cursor-pointer hover:underline hover:text-[var(--brand-purple)]">
                {t("auth.forgotPassword")}
              </span>
            </>
          ) : (
            <span onClick={() => navigate("/login")} className="text-[var(--brand-blue)] cursor-pointer hover:underline hover:text-[var(--brand-purple)]">
              {t("auth.backToLogin")}
            </span>
          )}
        </div>
        <div className="inline-flex items-center">
          <span onClick={goGuest} className="text-[var(--brand-blue)] cursor-pointer hover:underline hover:text-[var(--brand-purple)]">
            {t("auth.guestMode")}
          </span>
        </div>
      </div>
    ),
  };

  const agreeField: FormField = {
    name: "agree",
    label: "",
    span: 2,
    render: () => (
      <div className="text-[13px] text-[var(--brand-muted)] col-span-2 mt-1 mb-0 text-center whitespace-nowrap">
        {agreeText}
        <span className="ml-1 text-[var(--brand-blue)] cursor-pointer hover:underline hover:text-[var(--brand-purple)]">
          {t("auth.serviceAgreement")}
        </span>
      </div>
    ),
  };

  return [navField, agreeField];
}

export default createNavAgreeFields;
