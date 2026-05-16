import type { Metadata } from "next";
import Link from "next/link";

import { AdminOverviewView } from "@/components/admin/admin-overview-view";
import { ProductManagement } from "@/components/admin/product-management";
import { SectionHeading } from "@/components/storefront/section-heading";
import { SiteHeader } from "@/components/storefront/site-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dashboard Admin | Katta Adventure",
  description: "Dashboard statistik dan overview performa toko."
};

export default function AdminPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader currentPath="/admin" />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Dashboard Admin"
          title="Performa toko"
          description="Ringkasan statistik pelanggan, pesanan, produk, dan revenue."
        />

        <AdminOverviewView />

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/orders">Manajemen pesanan</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/customers">Manajemen pelanggan</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/reports">Laporan penjualan</Link>
          </Button>
        </div>

        <div className="mt-8">
          <ProductManagement />
        </div>
      </section>
    </main>
  );
}
