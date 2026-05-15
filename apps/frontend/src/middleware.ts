import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = ["/cart", "/checkout", "/orders", "/profile", "/admin"];
const adminOnlyPrefixes = ["/admin"];
const authPages = ["/login", "/register", "/forgot-password"];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isAuthPage(pathname: string) {
  return authPages.some((page) => pathname === page);
}

function isAdminOnlyPath(pathname: string) {
  return adminOnlyPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.get("ka_session")?.value === "1";
  const role = request.cookies.get("ka_role")?.value;
  const isAdmin = role === "admin";

  if (isProtectedPath(pathname) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && isAdminOnlyPath(pathname) && !isAdmin) {
    return NextResponse.redirect(new URL("/orders", request.url));
  }

  if (isAuthPage(pathname) && hasSession) {
    return NextResponse.redirect(new URL(isAdmin ? "/admin" : "/orders", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password"
  ]
};
