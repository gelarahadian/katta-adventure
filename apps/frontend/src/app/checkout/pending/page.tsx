import type { Metadata } from "next";

import { CheckoutResultView } from "@/components/checkout/checkout-result-view";
import { SiteHeader } from "@/components/storefront/site-header";

export const metadata: Metadata = {
  title: "Payment Pending | Katta Adventure",
  description: "Status pembayaran pesanan masih menunggu konfirmasi."
};

export default function CheckoutPendingPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader currentPath="/cart" />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <CheckoutResultView initialVariant="pending" />
      </section>
    </main>
  );
}
