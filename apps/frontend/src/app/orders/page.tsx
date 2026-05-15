import type { Metadata } from "next";
import { OrdersPageView } from "@/components/orders/orders-page-view";
import { SectionHeading } from "@/components/storefront/section-heading";
import { SiteHeader } from "@/components/storefront/site-header";

export const metadata: Metadata = {
  title: "Pesanan | Katta Adventure",
  description: "Riwayat pesanan dan status pembayaran Katta Adventure."
};

export default function OrdersPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader currentPath="/cart" />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pesanan"
          title="Riwayat pesanan"
          description="Pantau status order dan pembayaran setelah checkout."
        />

        <OrdersPageView />
      </section>
    </main>
  );
}
