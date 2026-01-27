import React from "react";
import type { FormField } from "@/components/Form";
import Button from "@/components/Button";

export function createNavAgreeFields(
  navigate: (path: string) => void,
  goGuest: () => void,
  smallPrimaryButton: string,
  smallNeutralButton: string,
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
              <Button className={`${smallPrimaryButton} text-blue-600`} onClick={() => navigate("/register")}>
                注册
              </Button>
              <span className="text-[rgba(0,0,0,0.3)]">|</span>
              <Button className={`${smallPrimaryButton} text-blue-600`} onClick={() => navigate("/forget-password")}>
                忘记密码
              </Button>
            </>
          ) : (
            <>
              <Button className={`${smallNeutralButton} text-blue-600`} onClick={() => navigate("/login")}>
                返回登录
              </Button>
            </>
          )}
        </div>
        <div className="inline-flex items-center">
          <Button className={`${smallNeutralButton} text-blue-600`} onClick={goGuest}>
            游客模式
          </Button>
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
        <span className="ml-1 underline text-blue-600 cursor-pointer hover:text-[#6d28d9]">《服务协议条款》</span>
      </div>
    ),
  };

  return [navField, agreeField];
}

export default createNavAgreeFields;
