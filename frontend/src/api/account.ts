import http from "./http";

export interface AccountProfile {
  id: number;
  name: string;
  email: string;
  avatar_url: string;
  bio: string;
  role: string;
  school: string;
  major: string;
  timezone: string;
  locale: string;
  status: string;
  provider: string;
  created_at: string;
  updated_at: string;
}

export interface AccountPreference {
  user_id: number;
  language: string;
  theme: string;
  effects_enabled: boolean;
  email_notifications: boolean;
  product_notifications: boolean;
  security_emails: boolean;
  default_model: string;
  code_model: string;
  output_style: string;
  context_current_file: boolean;
  context_project_files: boolean;
  context_history: boolean;
  share_usage_data: boolean;
  profile_visible: string;
  default_account_page: string;
}

export interface AccountIdentity {
  provider: "email" | "github" | "google" | "microsoft" | string;
  provider_email: string;
  provider_name: string;
  avatar_url: string;
  linked: boolean;
  last_used_at?: string;
}

export interface AccountEvent {
  id: number;
  type: string;
  message: string;
  ip: string;
  user_agent: string;
  created_at: string;
}

export interface AccountOverview {
  profile: AccountProfile;
  preferences: AccountPreference;
  identities: AccountIdentity[];
  has_password: boolean;
  recent_events: AccountEvent[];
}

export async function getAccountOverview() {
  const { data } = await http.get<AccountOverview>("/account/overview");
  return data;
}

export async function getAccountProfile() {
  const { data } = await http.get<AccountProfile>("/account/profile");
  return data;
}

export async function updateAccountProfile(payload: Partial<AccountProfile>) {
  const { data } = await http.patch<AccountProfile>("/account/profile", payload);
  return data;
}

export async function uploadAccountAvatar(file: File) {
  const body = new FormData();
  body.append("avatar", file);
  const { data } = await http.post<{ avatar_url: string }>("/account/avatar", body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateAccountEmail(payload: { email: string; code: string }) {
  const { data } = await http.patch<AccountProfile>("/account/email", payload);
  return data;
}

export async function changeAccountPassword(payload: {
  current_password?: string;
  new_password: string;
}) {
  const { data } = await http.patch<{ ok: boolean }>("/account/password", payload);
  return data;
}

export async function getAccountPreferences() {
  const { data } = await http.get<AccountPreference>("/account/preferences");
  return data;
}

export async function updateAccountPreferences(payload: Partial<AccountPreference>) {
  const { data } = await http.patch<AccountPreference>("/account/preferences", payload);
  return data;
}

export async function getAccountIdentities() {
  const { data } = await http.get<{ items: AccountIdentity[] }>("/account/identities");
  return data.items;
}

export async function unlinkAccountIdentity(provider: string) {
  const { data } = await http.delete<{ ok: boolean }>(`/account/identities/${encodeURIComponent(provider)}`);
  return data;
}

export async function getAccountEvents() {
  const { data } = await http.get<{ items: AccountEvent[] }>("/account/events");
  return data.items;
}

export async function submitAccountFeedback(payload: { category: string; message: string }) {
  const { data } = await http.post("/account/feedback", payload);
  return data;
}

export async function deleteAccount(payload: { password?: string; confirm: string }) {
  const { data } = await http.delete<{ ok: boolean }>("/account", { data: payload });
  return data;
}
