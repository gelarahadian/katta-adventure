"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { listAdminOrders, updateAdminOrderStatus, type AdminOrderListResponse } from "@/lib/admin-client";
import { Button } from "@/components/ui/button";

const statusOptions = [
  "PENDING",
  "AWAITING_PAYMENT",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED"
];

export function OrderManagement() {
  const [orders, setOrders] = useState<AdminOrderListResponse["items"]>([]);
  const [loading, setLoading] = useState(true);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);

  async function loadOrders() {
    setLoading(true);
    try {
      const response = await listAdminOrders();
      setOrders(response.items);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memuat order management");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  async function onUpdateStatus(orderId: string, status: string) {
    setBusyOrderId(orderId);
    try {
      await updateAdminOrderStatus(orderId, status);
      toast.success("Status order berhasil diperbarui");
      await loadOrders();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal update status order");
    } finally {
      setBusyOrderId(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Memuat order management...</p>;
  }

  return (
    <div className="space-y-3">
      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada data pesanan.</p>
      ) : (
        orders.map((order) => (
          <article key={order.id} className="rounded-md border border-border/60 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{order.orderNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {order.customer.name} - {order.customer.email}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Payment: {order.payment?.status ?? "-"}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="h-9 rounded-md border border-border bg-white px-2 text-sm"
                  value={order.status}
                  onChange={(event) => void onUpdateStatus(order.id, event.target.value)}
                  disabled={busyOrderId === order.id}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busyOrderId === order.id}
                  onClick={() => void onUpdateStatus(order.id, order.status)}
                >
                  {busyOrderId === order.id ? "Updating..." : "Refresh"}
                </Button>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
