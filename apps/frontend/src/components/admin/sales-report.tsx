"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getAdminSalesReport, type AdminSalesReportResponse } from "@/lib/admin-client";
import { formatPrice } from "@/data/products";
import { Button } from "@/components/ui/button";

export function SalesReport() {
  const [period, setPeriod] = useState<"daily" | "monthly">("daily");
  const [report, setReport] = useState<AdminSalesReportResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      try {
        const response = await getAdminSalesReport(period);
        setReport(response);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Gagal memuat sales report");
      } finally {
        setLoading(false);
      }
    }

    void loadReport();
  }, [period]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant={period === "daily" ? "default" : "outline"} onClick={() => setPeriod("daily")}>
          Harian
        </Button>
        <Button variant={period === "monthly" ? "default" : "outline"} onClick={() => setPeriod("monthly")}>
          Bulanan
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Memuat laporan penjualan...</p>
      ) : report && report.items.length > 0 ? (
        <div className="space-y-3">
          {report.items.map((row) => (
            <article key={row.label} className="rounded-md border border-border/60 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{row.label}</p>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{formatPrice(Number(row.totalRevenue))}</p>
                  <p className="text-xs text-muted-foreground">Orders: {row.totalOrders}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Belum ada data sales report.</p>
      )}
    </div>
  );
}
