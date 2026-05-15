import type { CreateOrderPayload, CreateOrderResponse, OrderStatusResponse } from "@/types/checkout";

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
    return new Error(payload.message ?? "Checkout failed");
  } catch {
    return new Error("Checkout failed");
  }
}

export async function createOrder(payload: CreateOrderPayload) {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as CreateOrderResponse;
}

export async function getOrderStatus(orderNumber: string) {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/orders/${encodeURIComponent(orderNumber)}/status`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as OrderStatusResponse;
}

export interface OrderListItem {
  id: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string | null;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  state: "success" | "pending" | "failed" | "refunded";
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string | null;
  subtotalAmount: string;
  shippingAmount: string;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  state: "success" | "pending" | "failed" | "refunded";
  shippingAddress: {
    recipientName: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    postalCode: string;
    line1: string;
    line2: string | null;
  };
  items: Array<{
    id: string;
    productName: string;
    productSku: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    productImage: string | null;
  }>;
}

export async function listOrders() {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/orders`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as { items: OrderListItem[] };
}

export async function getOrderDetail(orderNumber: string) {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/orders/${encodeURIComponent(orderNumber)}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as OrderDetail;
}
