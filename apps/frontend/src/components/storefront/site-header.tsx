"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AuthActions } from "@/components/auth/auth-actions";
import { getAuthUser, hasAuthSession } from "@/lib/auth-session";
import { cn } from "@/lib/utils";
import { CartIconButton } from "@/components/cart/cart-icon-button";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/profile", label: "Profile" },
  { href: "/orders", label: "Orders" },
  { href: "/admin", label: "Admin", adminOnly: true },
  { href: "#collections", label: "Collections" },
  { href: "#support", label: "Support" }
];

interface SiteHeaderProps {
  currentPath?: string;
}

export function SiteHeader({ currentPath }: SiteHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setMounted(true);
    const session = hasAuthSession();
    if (!session) {
      setIsAdmin(false);
      return;
    }

    const user = getAuthUser();
    setIsAdmin(user?.role === "admin");
  }, []);

  const visibleNavItems = useMemo(() => {
    if (!mounted) {
      return navItems.filter((item) => !("adminOnly" in item));
    }

    return navItems.filter((item) => {
      if ("adminOnly" in item && item.adminOnly) {
        return isAdmin;
      }
      return true;
    });
  }, [isAdmin, mounted]);

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
            KA
          </span>
          <div className="leading-tight">
            <p className="font-semibold tracking-tight">Katta Adventure</p>
            <p className="text-xs text-muted-foreground">Outdoor supply store</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground",
                currentPath === item.href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <AuthActions />
          <Button size="icon" variant="outline" aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>
          <CartIconButton />
          <Button size="icon" variant="outline" className="md:hidden" aria-label="Menu">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
