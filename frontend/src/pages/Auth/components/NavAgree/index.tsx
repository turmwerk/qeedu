import type { FormField } from "@/components/Form";

export function createNavAgreeFields(
  navigate: (path: string) => void,
  goGuest: () => void,
  agreeText = "登录即代表您已阅读并同意",
  page: "login" | "register" | "forget" = "login",
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
                注册
              </span>
              <span className="text-[var(--brand-muted)]">|</span>
              <span onClick={() => navigate("/forget-password")} className="text-[var(--brand-blue)] cursor-pointer hover:underline hover:text-[var(--brand-purple)]">
                忘记密码
              </span>
            </>
          ) : (
            <>
              <span onClick={() => navigate("/login")} className="text-[var(--brand-blue)] cursor-pointer hover:underline hover:text-[var(--brand-purple)]">
                返回登录
              </span>
            </>
          )}
        </div>
        <div className="inline-flex items-center">
          <span onClick={goGuest} className="text-[var(--brand-blue)] cursor-pointer hover:underline hover:text-[var(--brand-purple)]">
            游客模式
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
      <div className="text-[13px] text-[#666] col-span-2 mb-1 text-center">
        {agreeText}
        <span className="ml-1 underline text-[var(--brand-blue)] cursor-pointer hover:text-[var(--brand-purple)]">《服务协议》</span>
      </div>
    ),
  };

  return [navField, agreeField];
}

export default createNavAgreeFields;
