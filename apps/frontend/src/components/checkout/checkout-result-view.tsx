"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { getOrderStatus } from "@/lib/checkout-client";
import type { OrderStatusResponse } from "@/types/checkout";
import { Button } from "@/components/ui/button";

interface CheckoutResultViewProps {
  initialVariant: "success" | "pending" | "failed";
}

const pollIntervalMs = 4000;
const pollTimeoutMs = 60000;

export function CheckoutResultView({ initialVariant }: CheckoutResultViewProps) {
  const params = useSearchParams();
  const queryOrderId = params.get("order_id") ?? "";

  const [orderNumberInput, setOrderNumberInput] = useState(queryOrderId);
  const [status, setStatus] = useState<OrderStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const activeOrderNumber = useMemo(() => orderNumberInput.trim(), [orderNumberInput]);

  async function fetchStatus(orderNumber: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderStatus(orderNumber);
      setStatus(data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Gagal mengambil status order");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!queryOrderId) {
      return;
    }
    void fetchStatus(queryOrderId);
  }, [queryOrderId]);

  useEffect(() => {
    if (!status || status.state === "success" || status.state === "failed" || status.state === "refunded") {
      return;
    }

    const intervalId = window.setInterval(() => {
      void fetchStatus(status.orderNumber);
    }, pollIntervalMs);

    const timeoutId = window.setTimeout(() => {
      window.clearInterval(intervalId);
    }, pollTimeoutMs);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [status]);

  const visualState = status?.state ?? initialVariant;

  const title =
    visualState === "success"
      ? "Pembayaran berhasil"
      : visualState === "pending"
        ? "Menunggu pembayaran"
        : visualState === "refunded"
          ? "Pembayaran direfund"
          : "Pembayaran belum berhasil";

  const description =
    visualState === "success"
      ? "Pesanan kamu sudah terkonfirmasi dan sedang diproses."
      : visualState === "pending"
        ? "Selesaikan pembayaran di Midtrans lalu status akan otomatis diperbarui."
        : visualState === "refunded"
          ? "Pembayaran untuk pesanan ini sudah direfund."
          : "Pembayaran dibatalkan, kadaluarsa, atau gagal. Coba lakukan checkout ulang.";

  return (
    <div className="rounded-lg border border-border/70 bg-white/80 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Status Pembayaran</p>
      <h2 className="mt-3 font-serif text-3xl tracking-tight">{title}</h2>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>

      <div className="mt-6 space-y-3 rounded-md border border-border/70 bg-white/70 p-4 text-sm">
        <p>
          <span className="text-muted-foreground">Order:</span>{" "}
          <span className="font-medium">{status?.orderNumber ?? "-"}</span>
        </p>
        <p>
          <span className="text-muted-foreground">Order status:</span>{" "}
          <span className="font-medium">{status?.orderStatus ?? "-"}</span>
        </p>
        <p>
          <span className="text-muted-foreground">Payment status:</span>{" "}
          <span className="font-medium">{status?.paymentStatus ?? "-"}</span>
        </p>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="mt-4 text-sm text-muted-foreground">Memuat status terbaru...</p> : null}

      {!queryOrderId ? (
        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            if (activeOrderNumber) {
              void fetchStatus(activeOrderNumber);
            }
          }}
        >
          <input
            value={orderNumberInput}
            onChange={(event) => setOrderNumberInput(event.target.value)}
            placeholder="Masukkan order number (contoh: KTA-123...)"
            className="h-10 flex-1 rounded-md border border-border bg-white px-3 text-sm"
          />
          <Button type="submit" variant="outline">
            Cek status
          </Button>
        </form>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => (status ? void fetchStatus(status.orderNumber) : undefined)}>
          Cek lagi
        </Button>
        <Button asChild variant="outline">
          <Link href="/orders">Lihat riwayat pesanan</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/cart">Kembali ke cart</Link>
        </Button>
        <Button asChild>
          <Link href="/products">Lanjut belanja</Link>
        </Button>
      </div>
    </div>
  );
}
