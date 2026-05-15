"use client";

import type { AuthUser } from "@/types/auth";

const tokenKey = "ka_access_token";
const userKey = "ka_auth_user";
const sessionCookie = "ka_session";
const roleCookie = "ka_role";

function parseJwtExpiry(token: string) {
  try {
    const payloadRaw = token.split(".")[1];
    if (!payloadRaw) {
      return null;
    }

    const payloadJson = atob(payloadRaw.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadJson) as { exp?: number };
    if (!payload.exp) {
      return null;
    }

    return payload.exp;
  } catch {
    return null;
  }
}

function normalizeRole(role: AuthUser["role"] | string) {
  return role.toString().toLowerCase() === "admin" ? "admin" : "customer";
}

function normalizeUser(user: AuthUser): AuthUser {
  return {
    ...user,
    role: normalizeRole(user.role)
  };
}

export function setAuthSession(user: AuthUser, accessToken: string) {
  const normalizedUser = normalizeUser(user);
  const exp = parseJwtExpiry(accessToken);
  const now = Math.floor(Date.now() / 1000);
  const maxAgeSeconds = exp ? Math.max(0, exp - now) : 60 * 15;

  localStorage.setItem(tokenKey, accessToken);
  localStorage.setItem(userKey, JSON.stringify(normalizedUser));
  document.cookie = `${sessionCookie}=1; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
  document.cookie = `${roleCookie}=${normalizedUser.role}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
  window.dispatchEvent(new Event("auth:changed"));
}

export function clearAuthSession() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
  document.cookie = `${sessionCookie}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `${roleCookie}=; Path=/; Max-Age=0; SameSite=Lax`;
  window.dispatchEvent(new Event("auth:changed"));
}

export function hasAuthSession() {
  const token = localStorage.getItem(tokenKey);
  if (!token) {
    return false;
  }

  const exp = parseJwtExpiry(token);
  if (!exp) {
    return true;
  }

  const now = Math.floor(Date.now() / 1000);
  const valid = exp > now;
  if (!valid) {
    clearAuthSession();
  }
  return valid;
}

export function getAuthUser() {
  const raw = localStorage.getItem(userKey);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthUser;
    return normalizeUser(parsed);
  } catch {
    clearAuthSession();
    return null;
  }
}

export function updateStoredAuthUser(user: AuthUser) {
  const normalizedUser = normalizeUser(user);
  localStorage.setItem(userKey, JSON.stringify(normalizedUser));
  document.cookie = `${roleCookie}=${normalizedUser.role}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  window.dispatchEvent(new Event("auth:changed"));
}
