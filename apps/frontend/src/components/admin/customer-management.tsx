"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { listAdminCustomers, type AdminCustomerListResponse } from "@/lib/admin-client";

export function CustomerManagement() {
  const [customers, setCustomers] = useState<AdminCustomerListResponse["items"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await listAdminCustomers();
        setCustomers(response.items);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Gagal memuat customer data");
      } finally {
        setLoading(false);
      }
    }

    void loadCustomers();
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Memuat data customer...</p>;
  }

  return (
    <div className="space-y-3">
      {customers.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada customer.</p>
      ) : (
        customers.map((customer) => (
          <article key={customer.id} className="rounded-md border border-border/60 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{customer.name}</p>
                <p className="text-xs text-muted-foreground">{customer.email}</p>
                <p className="text-xs text-muted-foreground">Phone: {customer.phone ?? "-"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Status: {customer.status}</p>
                <p className="text-xs text-muted-foreground">Orders: {customer.totalOrders}</p>
                <p className="text-xs text-muted-foreground">Payments: {customer.totalPayments}</p>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
