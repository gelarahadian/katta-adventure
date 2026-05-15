"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { logoutRequest } from "@/lib/auth-client";
import { clearAuthSession, getAuthUser, hasAuthSession } from "@/lib/auth-session";
import { Button } from "@/components/ui/button";

export function AuthActions() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
    const session = hasAuthSession();
    setIsAuthenticated(session);
    const user = getAuthUser();
    setDisplayName(user?.name ?? null);
    setIsAdmin(user?.role === "admin");
  }, []);

  async function onLogout() {
    setIsLoggingOut(true);
    try {
      await logoutRequest();
    } catch {
      // Ignore network/logout API error and clear local session anyway.
    } finally {
      clearAuthSession();
      setIsAuthenticated(false);
      setDisplayName(null);
      setIsAdmin(false);
      setIsLoggingOut(false);
      router.push("/login");
      router.refresh();
    }
  }

  if (!mounted) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Button asChild variant="secondary" className="hidden sm:inline-flex">
        <Link href="/login">Login</Link>
      </Button>
    );
  }

  return (
    <div className="hidden items-center gap-2 sm:flex">
      {displayName ? <span className="text-xs text-muted-foreground">Hi, {displayName.split(" ")[0]}</span> : null}
      <Button asChild type="button" variant="outline">
        <Link href={isAdmin ? "/admin" : "/profile"}>{isAdmin ? "Admin Panel" : "Profile"}</Link>
      </Button>
      <Button type="button" variant="secondary" onClick={onLogout} disabled={isLoggingOut}>
        {isLoggingOut ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
}
