import { apiGet, apiPost } from "@/lib/api";

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
};

export async function getMe() {
  return apiGet<AuthUser>("/auth/me/");
}

export async function loginUser(input: {
  username: string;
  password: string;
}) {
  return apiPost<AuthUser>("/auth/login/", input);
}

export async function signupUser(input: {
  username: string;
  email?: string;
  password: string;
}) {
  return apiPost<AuthUser>("/auth/signup/", input);
}

export async function logoutUser() {
  return apiPost<{ detail: string }>("/auth/logout/", {});
}