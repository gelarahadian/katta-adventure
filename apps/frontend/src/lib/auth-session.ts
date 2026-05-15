"use client";

import type { AuthUser } from "@/types/auth";

const tokenKey = "ka_access_token";
const userKey = "ka_auth_user";
const sessionCookie = "ka_session";

export function setAuthSession(user: AuthUser, accessToken: string) {
  localStorage.setItem(tokenKey, accessToken);
  localStorage.setItem(userKey, JSON.stringify(user));
  document.cookie = `${sessionCookie}=1; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearAuthSession() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
  document.cookie = `${sessionCookie}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function hasAuthSession() {
  const token = localStorage.getItem(tokenKey);
  return Boolean(token);
}

export function getAuthUser() {
  const raw = localStorage.getItem(userKey);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    clearAuthSession();
    return null;
  }
}
