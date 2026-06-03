import http from "./http";

export interface AuthUser {
  id: number;
  name: string;
  email?: string;
  avatar_url?: string;
  provider?: string;
}

export interface SendCodeResponse {
  ok: boolean;
  message?: string;
  dev_code?: string;
}

export async function sendEmailCode(email: string, purpose: "login" | "register" | "reset" | "change_email") {
  const res = await http.post<SendCodeResponse>("/auth/send-code", { email, purpose });
  return res.data;
}

export async function loginWithPassword(account: string, password: string) {
  const res = await http.post<AuthUser>("/auth/login", {
    method: "password",
    account,
    password,
  });
  return res.data;
}

export async function loginWithEmailCode(email: string, code: string) {
  const res = await http.post<AuthUser>("/auth/login", {
    method: "email_code",
    email,
    code,
  });
  return res.data;
}

export async function registerWithEmail(params: {
  email: string;
  name?: string;
  code: string;
  password: string;
}) {
  const res = await http.post<AuthUser>("/auth/register", params);
  return res.data;
}

export async function resetPasswordWithEmail(params: {
  email: string;
  code: string;
  new_password: string;
}) {
  const res = await http.post<AuthUser>("/auth/reset-password", params);
  return res.data;
}

export async function logoutRequest() {
  await http.post("/auth/logout");
}
