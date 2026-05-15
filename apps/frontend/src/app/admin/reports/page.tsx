import type { Metadata } from "next";

import { SalesReport } from "@/components/admin/sales-report";
import { SectionHeading } from "@/components/storefront/section-heading";
import { SiteHeader } from "@/components/storefront/site-header";

export const metadata: Metadata = {
  title: "Sales Report | Katta Adventure",
  description: "Laporan penjualan harian dan bulanan untuk analisis performa toko."
};

export default function AdminReportsPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader currentPath="/admin" />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Sales Report"
          title="Laporan penjualan"
          description="Pantau total revenue dan jumlah order per periode harian atau bulanan."
        />

        <div className="mt-8 rounded-lg border border-border/70 bg-white/80 p-5">
          <SalesReport />
        </div>
      </section>
    </main>
  );
}
