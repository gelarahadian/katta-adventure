import type { Metadata } from "next";
import Link from "next/link";

import { formatPrice } from "@/data/products";
import { getAdminOverview } from "@/lib/admin-client";
import { ProductManagement } from "@/components/admin/product-management";
import { SectionHeading } from "@/components/storefront/section-heading";
import { SiteHeader } from "@/components/storefront/site-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Dashboard | Katta Adventure",
  description: "Dashboard statistik dan overview performa toko."
};

export default async function AdminPage() {
  const overview = await getAdminOverview();

  return (
    <main className="min-h-screen">
      <SiteHeader currentPath="/admin" />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Admin Dashboard"
          title="Store performance"
          description="Ringkasan statistik pelanggan, pesanan, produk, dan revenue."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Customers" value={overview.stats.totalCustomers.toString()} />
          <StatCard label="Active Products" value={overview.stats.totalProducts.toString()} />
          <StatCard label="Total Orders" value={overview.stats.totalOrders.toString()} />
          <StatCard label="Pending Orders" value={overview.stats.pendingOrders.toString()} />
          <StatCard label="Paid Payments" value={overview.stats.successfulPayments.toString()} />
          <StatCard label="Monthly Revenue" value={formatPrice(Number(overview.stats.monthlyRevenue))} />
          <StatCard label="Total Revenue" value={formatPrice(Number(overview.stats.totalRevenue))} />
        </div>

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

        <div className="mt-8 rounded-lg border border-border/70 bg-white/80 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Recent orders</p>
          <div className="mt-4 space-y-3">
            {overview.recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada pesanan terbaru.</p>
            ) : (
              overview.recentOrders.map((order) => (
                <article key={order.id} className="rounded-md border border-border/60 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.customer.name} - {order.customer.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{formatPrice(Number(order.totalAmount))}</p>
                      <p className="text-xs text-muted-foreground">{order.status}</p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="mt-8">
          <ProductManagement />
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-lg border border-border/70 bg-white/80 p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
    </article>
  );
}
