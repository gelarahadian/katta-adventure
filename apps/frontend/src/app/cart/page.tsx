import type { Metadata } from "next";

import { CartView } from "@/components/cart/cart-view";
import { SectionHeading } from "@/components/storefront/section-heading";
import { SiteHeader } from "@/components/storefront/site-header";

export const metadata: Metadata = {
  title: "Cart | Katta Adventure",
  description: "Lihat, update quantity, dan hapus item di keranjang belanja Katta Adventure."
};

export default function CartPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader currentPath="/cart" />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Keranjang"
          title="Belanjaan kamu"
          description="Kelola item sebelum lanjut ke checkout: update quantity, hapus produk, dan cek subtotal."
        />

        <div className="mt-8">
          <CartView />
        </div>
      </section>
    </main>
  );
}
