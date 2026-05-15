import type { CreateOrderPayload, CreateOrderResponse, OrderStatusResponse } from "@/types/checkout";
import { authGet, authPost } from "@/lib/auth-client";

export async function createOrder(payload: CreateOrderPayload) {
  return authPost<CreateOrderResponse>("/api/v1/orders", payload);
}

export async function getOrderStatus(orderNumber: string) {
  return authGet<OrderStatusResponse>(`/api/v1/orders/${encodeURIComponent(orderNumber)}/status`);
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
  return authGet<{ items: OrderListItem[] }>("/api/v1/orders");
}

export async function getOrderDetail(orderNumber: string) {
  return authGet<OrderDetail>(`/api/v1/orders/${encodeURIComponent(orderNumber)}`);
}
