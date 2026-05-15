import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/data/products";
import { getOrderDetail } from "@/lib/checkout-client";
import { SectionHeading } from "@/components/storefront/section-heading";
import { SiteHeader } from "@/components/storefront/site-header";
import { Button } from "@/components/ui/button";

const fallbackImage =
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80";

interface OrderDetailPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order ${orderNumber} | Katta Adventure`,
    description: "Detail pesanan dan tracking status pembayaran."
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderNumber } = await params;
  const order = await getOrderDetail(orderNumber);

  return (
    <main className="min-h-screen">
      <SiteHeader currentPath="/cart" />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Tracking"
          title={`Order ${order.orderNumber}`}
          description={`Status order: ${order.orderStatus}. Status payment: ${order.paymentStatus ?? "-"}.`}
        />

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
      </section>
    </main>
  );
}
