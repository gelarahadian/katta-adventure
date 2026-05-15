"use client";

import { useEffect, useState } from "react";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getCart } from "@/lib/cart-client";
import type { CartResponse } from "@/types/cart";

export function CheckoutPageView() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCart() {
      try {
        const response = await getCart();
        setCart(response);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat keranjang");
      } finally {
        setLoading(false);
      }
    }

    void loadCart();
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Memuat checkout...</p>;
  }

  if (error || !cart) {
    return <p className="text-sm text-red-600">{error ?? "Keranjang tidak ditemukan"}</p>;
  }

  return <CheckoutForm cart={cart} />;
}
