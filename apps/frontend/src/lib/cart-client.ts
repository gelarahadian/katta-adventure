import type { CartResponse } from "@/types/cart";
import { authDelete, authGet, authPatch, authPost } from "@/lib/auth-client";

export function getCart() {
  return authGet<CartResponse>("/api/v1/cart");
}

export function addCartItem(payload: { productId: string; quantity: number }) {
  return authPost<CartResponse>("/api/v1/cart/items", payload);
}

export function updateCartItem(itemId: string, payload: { quantity: number }) {
  return authPatch<CartResponse>(`/api/v1/cart/items/${itemId}`, payload);
}

export function removeCartItem(itemId: string) {
  return authDelete<CartResponse>(`/api/v1/cart/items/${itemId}`);
}
