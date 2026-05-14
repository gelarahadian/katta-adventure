"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import { getCart } from "@/lib/cart-client";
import { Button } from "@/components/ui/button";

export function CartIconButton() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadCartCount() {
      try {
        const cart = await getCart();
        if (active) {
          setCount(cart.summary.totalItems);
        }
      } catch {
        if (active) {
          setCount(0);
        }
      }
    }

    void loadCartCount();

    function handleCartUpdated() {
      void loadCartCount();
    }

    window.addEventListener("cart:updated", handleCartUpdated as EventListener);
    return () => {
      active = false;
      window.removeEventListener("cart:updated", handleCartUpdated as EventListener);
    };
  }, []);

  return (
    <Button asChild size="icon" variant="outline" aria-label="Cart" className="relative">
      <Link href="/cart">
        <ShoppingBag className="h-4 w-4" />
        {count > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </Link>
    </Button>
  );
}
