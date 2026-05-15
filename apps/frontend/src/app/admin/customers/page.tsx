import type { Metadata } from "next";

import { CustomerManagement } from "@/components/admin/customer-management";
import { SectionHeading } from "@/components/storefront/section-heading";
import { SiteHeader } from "@/components/storefront/site-header";

export const metadata: Metadata = {
  title: "Customer Management | Katta Adventure",
  description: "Data customer untuk pemantauan aktivitas dan transaksi."
};

export default function AdminCustomersPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader currentPath="/admin" />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Customer Management"
          title="Data pelanggan"
          description="Pantau status customer serta total order dan payment mereka."
        />

        <div className="mt-8 rounded-lg border border-border/70 bg-white/80 p-5">
          <CustomerManagement />
        </div>
      </section>
    </main>
  );
}
