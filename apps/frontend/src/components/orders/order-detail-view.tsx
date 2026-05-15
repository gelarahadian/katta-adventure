"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { formatPrice } from "@/data/products";
import { getOrderDetail, type OrderDetail } from "@/lib/checkout-client";
import { Button } from "@/components/ui/button";

const fallbackImage =
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80";

export function OrderDetailView({ orderNumber }: { orderNumber: string }) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        const response = await getOrderDetail(orderNumber);
        setOrder(response);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat detail order");
      } finally {
        setLoading(false);
      }
    }

    void loadOrder();
  }, [orderNumber]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Memuat detail order...</p>;
  }

  if (error || !order) {
    return <p className="text-sm text-red-600">{error ?? "Order tidak ditemukan"}</p>;
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        {order.items.map((item) => (
          <article key={item.id} className="grid gap-4 rounded-lg border border-border/70 bg-white/75 p-4 sm:grid-cols-[120px_1fr]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
              <Image src={item.productImage ?? fallbackImage} alt={item.productName} fill className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{item.productName}</p>
              <p className="mt-1 text-xs text-muted-foreground">SKU: {item.productSku}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                {item.quantity} x {formatPrice(Number(item.unitPrice))}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">{formatPrice(Number(item.totalPrice))}</p>
            </div>
          </article>
        ))}
      </div>

      <aside className="h-fit rounded-lg border border-border/70 bg-white/80 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Ringkasan</p>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatPrice(Number(order.subtotalAmount))}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Ongkir</span>
            <span>{formatPrice(Number(order.shippingAmount))}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 font-semibold text-foreground">
            <span>Total</span>
            <span>{formatPrice(Number(order.totalAmount))}</span>
          </div>
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          Dikirim ke: {order.shippingAddress.recipientName}, {order.shippingAddress.phone}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {order.shippingAddress.line1}, {order.shippingAddress.district}, {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <Button asChild variant="outline">
            <Link href="/orders">Kembali ke riwayat</Link>
          </Button>
          <Button asChild>
            <Link href="/products">Lanjut belanja</Link>
          </Button>
        </div>
      </aside>
    </div>
  );
}
