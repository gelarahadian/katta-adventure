import type { Metadata } from "next";

import { OrderManagement } from "@/components/admin/order-management";
import { SectionHeading } from "@/components/storefront/section-heading";
import { SiteHeader } from "@/components/storefront/site-header";

export const metadata: Metadata = {
  title: "Order Management | Katta Adventure",
  description: "Kelola pesanan dan update status order dari admin panel."
};

export default function AdminOrdersPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader currentPath="/admin" />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Order Management"
          title="Kelola pesanan"
          description="Update status order berdasarkan progres pembayaran dan pengiriman."
        />

        <div className="mt-8 rounded-lg border border-border/70 bg-white/80 p-5">
          <OrderManagement />
        </div>
      </section>
    </main>
  );
}
