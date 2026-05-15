"use client";

import { useEffect, useState } from "react";

import { formatPrice } from "@/data/products";
import { getAdminOverview, type AdminOverviewResponse } from "@/lib/admin-client";

export function AdminOverviewView() {
  const [overview, setOverview] = useState<AdminOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOverview() {
      try {
        const response = await getAdminOverview();
        setOverview(response);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat overview admin");
      } finally {
        setLoading(false);
      }
    }

    void loadOverview();
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Memuat dashboard admin...</p>;
  }

  if (error || !overview) {
    return <p className="text-sm text-red-600">{error ?? "Overview admin tidak tersedia"}</p>;
  }

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Customers" value={overview.stats.totalCustomers.toString()} />
        <StatCard label="Active Products" value={overview.stats.totalProducts.toString()} />
        <StatCard label="Total Orders" value={overview.stats.totalOrders.toString()} />
        <StatCard label="Pending Orders" value={overview.stats.pendingOrders.toString()} />
        <StatCard label="Paid Payments" value={overview.stats.successfulPayments.toString()} />
        <StatCard label="Monthly Revenue" value={formatPrice(Number(overview.stats.monthlyRevenue))} />
        <StatCard label="Total Revenue" value={formatPrice(Number(overview.stats.totalRevenue))} />
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
                    <p className="text-xs text-muted-foreground">
                      {order.customer.name} - {order.customer.email}
                    </p>
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
    </>
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
