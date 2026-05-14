"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import { addCartItem } from "@/lib/cart-client";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
  size?: "default" | "sm" | "icon";
}

export function AddToCartButton({ productId, disabled = false, size = "default" }: AddToCartButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleAdd() {
    setIsSubmitting(true);
    try {
      await addCartItem({ productId, quantity });
      window.dispatchEvent(new Event("cart:updated"));
      toast.success("Produk ditambahkan ke keranjang");
      setIsOpen(false);
      setQuantity(1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menambah produk");
    } finally {
      setIsSubmitting(false);
    }
  }

  function decrease() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  function increase() {
    setQuantity((prev) => Math.min(99, prev + 1));
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} disabled={disabled || isSubmitting} size={size} className="w-full">
        {isSubmitting ? "Memproses..." : "Add to cart"}
      </Button>

      {isOpen && mounted
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-end bg-black/35" role="dialog" aria-modal="true">
              <div className="w-full rounded-t-2xl border border-border/70 bg-background p-5 shadow-2xl">
                <div className="mx-auto w-full max-w-3xl">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Atur Quantity</p>
                    <Button variant="outline" size="icon" onClick={() => setIsOpen(false)} aria-label="Close">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-white/75 p-4">
                    <p className="text-sm text-muted-foreground">Jumlah yang akan ditambahkan</p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={decrease} disabled={quantity <= 1}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="inline-flex h-10 min-w-12 items-center justify-center rounded-md border border-border bg-white px-3 text-sm font-semibold">
                        {quantity}
                      </span>
                      <Button variant="outline" size="icon" onClick={increase} disabled={quantity >= 99}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                      Batal
                    </Button>
                    <Button onClick={handleAdd} disabled={isSubmitting}>
                      {isSubmitting ? "Memproses..." : "Tambahkan"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
