"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";

import { formatPrice } from "@/data/products";
import { getCart, removeCartItem, updateCartItem } from "@/lib/cart-client";
import type { CartResponse } from "@/types/cart";
import { Button } from "@/components/ui/button";

const fallbackImage =
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80";

export function CartView() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadCart() {
    setError(null);
    setLoading(true);
    try {
      const data = await getCart();
      setCart(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat keranjang");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCart();
  }, []);

  async function onQtyChange(itemId: string, quantity: number) {
    try {
      const data = await updateCartItem(itemId, { quantity });
      setCart(data);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Gagal update quantity");
    }
  }

  async function adjustQty(itemId: string, currentQty: number, delta: number, maxStock: number) {
    const nextQty = Math.max(1, Math.min(maxStock, currentQty + delta));
    if (nextQty === currentQty) {
      return;
    }
    await onQtyChange(itemId, nextQty);
  }

  async function onRemove(itemId: string) {
    try {
      const data = await removeCartItem(itemId);
      setCart(data);
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Gagal hapus item");
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Memuat keranjang...</p>;
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-600">{error}</p>
        <Button variant="outline" onClick={() => void loadCart()}>
          Coba lagi
        </Button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-lg border border-border/70 bg-white/70 p-6 text-sm text-muted-foreground">
        Keranjang masih kosong. Yuk pilih produk dulu di <Link href="/products" className="text-primary underline">catalog</Link>.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {cart.items.map((item) => (
          <article
            key={item.id}
            className="grid gap-4 rounded-lg border border-border/70 bg-white/75 p-4 sm:grid-cols-[120px_1fr]"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
              <Image src={item.product.imageUrl ?? fallbackImage} alt={item.product.name} fill className="object-cover" />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">{item.product.slug}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="text-xs text-muted-foreground" htmlFor={`qty-${item.id}`}>
                  Quantity
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => void adjustQty(item.id, item.quantity, -1, Math.max(1, item.product.stock))}
                    disabled={item.quantity <= 1}
                    aria-label="Kurangi quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span
                    id={`qty-${item.id}`}
                    className="inline-flex h-9 min-w-10 items-center justify-center rounded-md border border-border bg-white px-2 text-sm font-medium"
                  >
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => void adjustQty(item.id, item.quantity, 1, Math.max(1, item.product.stock))}
                    disabled={item.quantity >= Math.max(1, item.product.stock)}
                    aria-label="Tambah quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => void onRemove(item.id)}>
                  Hapus
                </Button>
              </div>

              <p className="text-sm font-medium text-foreground">{formatPrice(Number(item.totalPrice))}</p>
            </div>
          </article>
        ))}
      </div>

      <aside className="h-fit rounded-lg border border-border/70 bg-white/80 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Ringkasan</p>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Total item</span>
            <span>{cart.summary.totalItems}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Jenis produk</span>
            <span>{cart.summary.distinctItems}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 font-semibold text-foreground">
            <span>Subtotal</span>
            <span>{formatPrice(Number(cart.summary.subtotal))}</span>
          </div>
        </div>
        <Button className="mt-5 w-full" asChild>
          <Link href="/checkout">Lanjut checkout</Link>
        </Button>
      </aside>
    </div>
  );
}
