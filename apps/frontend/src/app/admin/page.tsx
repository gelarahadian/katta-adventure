import type { Metadata } from "next";
import Link from "next/link";

import { AdminOverviewView } from "@/components/admin/admin-overview-view";
import { ProductManagement } from "@/components/admin/product-management";
import { SectionHeading } from "@/components/storefront/section-heading";
import { SiteHeader } from "@/components/storefront/site-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Dashboard | Katta Adventure",
  description: "Dashboard statistik dan overview performa toko."
};

export default function AdminPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader currentPath="/admin" />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Admin Dashboard"
          title="Store performance"
          description="Ringkasan statistik pelanggan, pesanan, produk, dan revenue."
        />

        <AdminOverviewView />

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/orders">Order management</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/customers">Customer management</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/reports">Sales reports</Link>
          </Button>
        </div>

        <div className="mt-8">
          <ProductManagement />
        </div>
      </section>
    </main>
  );
}
