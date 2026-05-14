"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { formatPrice } from "@/data/products";
import { createOrder } from "@/lib/checkout-client";
import type { CartResponse } from "@/types/cart";
import { Button } from "@/components/ui/button";

interface CheckoutFormProps {
  cart: CartResponse;
}

const flatShipping = 20000;

export function CheckoutForm({ cart }: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [form, setForm] = useState({
    recipientName: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    postalCode: "",
    line1: "",
    line2: "",
    notes: "",
    customerNote: "",
    paymentProvider: "MANUAL" as "MIDTRANS" | "XENDIT" | "MANUAL"
  });

  const subtotal = Number(cart.summary.subtotal);
  const grandTotal = useMemo(() => subtotal + flatShipping, [subtotal]);

  function updateField(name: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await createOrder({
        recipientName: form.recipientName,
        phone: form.phone,
        province: form.province,
        city: form.city,
        district: form.district,
        postalCode: form.postalCode,
        line1: form.line1,
        line2: form.line2 || undefined,
        notes: form.notes || undefined,
        customerNote: form.customerNote || undefined,
        paymentProvider: form.paymentProvider
      });
      setOrderNumber(result.order.orderNumber);
      window.dispatchEvent(new Event("cart:updated"));
      toast.success(`Pesanan berhasil dibuat: ${result.order.orderNumber}`);

      if (result.payment?.provider === "MIDTRANS" && result.payment.redirectUrl) {
        window.location.href = result.payment.redirectUrl;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout gagal");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-6 lg:grid-cols-[1fr_360px]" onSubmit={onSubmit}>
      <div className="space-y-6 rounded-lg border border-border/70 bg-white/75 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nama penerima" value={form.recipientName} onChange={(v) => updateField("recipientName", v)} />
          <Input label="Nomor HP" value={form.phone} onChange={(v) => updateField("phone", v)} />
          <Input label="Provinsi" value={form.province} onChange={(v) => updateField("province", v)} />
          <Input label="Kota" value={form.city} onChange={(v) => updateField("city", v)} />
          <Input label="Kecamatan" value={form.district} onChange={(v) => updateField("district", v)} />
          <Input label="Kode pos" value={form.postalCode} onChange={(v) => updateField("postalCode", v)} />
        </div>

        <Input label="Alamat utama" value={form.line1} onChange={(v) => updateField("line1", v)} />
        <Input label="Alamat tambahan (opsional)" value={form.line2} onChange={(v) => updateField("line2", v)} />

        <div className="space-y-2">
          <label className="text-sm font-medium">Catatan pengiriman</label>
          <textarea
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            className="min-h-24 w-full rounded-md border border-border bg-white px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Catatan order</label>
          <textarea
            value={form.customerNote}
            onChange={(event) => updateField("customerNote", event.target.value)}
            className="min-h-24 w-full rounded-md border border-border bg-white px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Metode pembayaran</label>
          <select
            value={form.paymentProvider}
            onChange={(event) => updateField("paymentProvider", event.target.value)}
            className="h-11 w-full rounded-md border border-border bg-white px-3 text-sm"
          >
            <option value="MANUAL">Manual transfer</option>
            <option value="MIDTRANS">Midtrans</option>
            <option value="XENDIT">Xendit</option>
          </select>
        </div>
      </div>

      <aside className="h-fit rounded-lg border border-border/70 bg-white/80 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Ringkasan checkout</p>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Ongkir flat</span>
            <span>{formatPrice(flatShipping)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 font-semibold text-foreground">
            <span>Total</span>
            <span>{formatPrice(grandTotal)}</span>
          </div>
        </div>

        <Button className="mt-5 w-full" type="submit" disabled={isSubmitting || cart.items.length === 0}>
          {isSubmitting ? "Memproses..." : "Buat Pesanan"}
        </Button>

        {orderNumber ? <p className="mt-3 text-sm text-primary">Order dibuat: {orderNumber}</p> : null}
      </aside>
    </form>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-border bg-white px-3 text-sm"
        required
      />
    </div>
  );
}
