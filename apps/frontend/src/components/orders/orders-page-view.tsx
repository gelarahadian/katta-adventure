"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { formatPrice } from "@/data/products";
import { listOrders, type OrderListItem } from "@/lib/checkout-client";
import { Button } from "@/components/ui/button";

export function OrdersPageView() {
  const router = useRouter();
  const [items, setItems] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await listOrders();
        setItems(response.items);
      } catch (loadError) {
        if (loadError instanceof Error && loadError.message.toLowerCase().includes("unauthorized")) {
          setError("Sesi login berakhir. Silakan login ulang.");
          router.push("/login?next=/orders");
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat pesanan");
      } finally {
        setLoading(false);
      }
    }

    void loadOrders();
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Memuat riwayat pesanan...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="mt-8 space-y-4">
      {items.length === 0 ? (
        <div className="rounded-lg border border-border/70 bg-white/75 p-6 text-sm text-muted-foreground">
          Belum ada pesanan. Yuk mulai dari{" "}
          <Link href="/products" className="text-primary underline">
            produk
          </Link>
          .
        </div>
      ) : (
        items.map((order) => (
          <article key={order.id} className="rounded-lg border border-border/70 bg-white/75 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{order.orderNumber}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Order: {order.orderStatus} - Pembayaran: {order.paymentStatus ?? "-"}
                </p>
              </div>
              <p className="text-sm font-semibold text-foreground">{formatPrice(Number(order.totalAmount))}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href={`/orders/${encodeURIComponent(order.orderNumber)}`}>Lihat detail</Link>
              </Button>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
