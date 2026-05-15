import type { Metadata } from "next";
import Link from "next/link";

import { formatPrice } from "@/data/products";
import { listOrders } from "@/lib/checkout-client";
import { SectionHeading } from "@/components/storefront/section-heading";
import { SiteHeader } from "@/components/storefront/site-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Orders | Katta Adventure",
  description: "Riwayat pesanan dan status pembayaran Katta Adventure."
};

export default async function OrdersPage() {
  const { items } = await listOrders();

  return (
    <main className="min-h-screen">
      <SiteHeader currentPath="/cart" />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pesanan"
          title="Riwayat pesanan"
          description="Pantau status order dan pembayaran setelah checkout."
        />

        <div className="mt-8 space-y-4">
          {items.length === 0 ? (
            <div className="rounded-lg border border-border/70 bg-white/75 p-6 text-sm text-muted-foreground">
              Belum ada pesanan. Yuk mulai dari <Link href="/products" className="text-primary underline">catalog</Link>.
            </div>
          ) : (
            items.map((order) => (
              <article key={order.id} className="rounded-lg border border-border/70 bg-white/75 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{order.orderNumber}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Order: {order.orderStatus} - Payment: {order.paymentStatus ?? "-"}
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
      </section>
    </main>
  );
}
