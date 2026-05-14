import type { CartResponse } from "@/types/cart";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  return API_BASE_URL;
}

async function parseError(response: Response) {
  try {
    const payload = (await response.json()) as { message?: string };
    return new Error(payload.message ?? "Cart request failed");
  } catch {
    return new Error("Cart request failed");
  }
}

async function request<TResponse>(path: string, init?: RequestInit) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as TResponse;
}

export function getCart() {
  return request<CartResponse>("/api/v1/cart");
}

export function addCartItem(payload: { productId: string; quantity: number }) {
  return request<CartResponse>("/api/v1/cart/items", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateCartItem(itemId: string, payload: { quantity: number }) {
  return request<CartResponse>(`/api/v1/cart/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function removeCartItem(itemId: string) {
  return request<CartResponse>(`/api/v1/cart/items/${itemId}`, {
    method: "DELETE"
  });
}
