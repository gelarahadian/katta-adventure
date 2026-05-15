import type { Metadata } from "next";

import { CheckoutPageView } from "@/components/checkout/checkout-page-view";
import { SectionHeading } from "@/components/storefront/section-heading";
import { SiteHeader } from "@/components/storefront/site-header";

export const metadata: Metadata = {
  title: "Checkout | Katta Adventure",
  description: "Lengkapi alamat pengiriman dan metode pembayaran untuk membuat pesanan."
};

export default async function CheckoutPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader currentPath="/cart" />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Checkout"
          title="Lengkapi pesanan"
          description="Isi alamat pengiriman, pilih metode pembayaran, lalu buat order dengan status awaiting payment."
        />

        <div className="mt-8">
          <CheckoutPageView />
        </div>
      </section>
    </main>
  );
}
