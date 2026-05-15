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
    const sync = () => {
      setMounted(true);
      const session = hasAuthSession();
      setIsAuthenticated(session);
      const user = getAuthUser();
      setDisplayName(user?.name ?? null);
      setIsAdmin(user?.role === "admin");
    };

    sync();
    window.addEventListener("auth:changed", sync as EventListener);
    return () => {
      window.removeEventListener("auth:changed", sync as EventListener);
    };
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
      <details className="relative">
        <summary className="list-none cursor-pointer rounded-md border border-border bg-white px-3 py-2 text-sm">
          Akun
        </summary>
        <div className="absolute right-0 z-40 mt-2 w-44 rounded-md border border-border/70 bg-white p-2 shadow-lg">
          <Link href="/orders" className="block rounded px-2 py-2 text-sm hover:bg-muted">
            Pesanan Saya
          </Link>
          <Link href="/profile" className="block rounded px-2 py-2 text-sm hover:bg-muted">
            Profil
          </Link>
          {isAdmin ? (
            <Link href="/admin" className="block rounded px-2 py-2 text-sm hover:bg-muted">
              Admin
            </Link>
          ) : null}
          <button
            type="button"
            className="mt-1 w-full rounded px-2 py-2 text-left text-sm hover:bg-muted"
            onClick={onLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Keluar..." : "Logout"}
          </button>
        </div>
      </details>
    </div>
  );
}
