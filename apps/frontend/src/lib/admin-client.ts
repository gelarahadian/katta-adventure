import { authGet, authPatch } from "@/lib/auth-client";

export interface AdminOverviewResponse {
  stats: {
    totalCustomers: number;
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    successfulPayments: number;
    totalRevenue: string;
    monthlyRevenue: string;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: string;
    createdAt: string;
    customer: {
      name: string;
      email: string;
    };
  }>;
}

export async function getAdminOverview() {
  return authGet<AdminOverviewResponse>("/api/v1/admin/overview");
}

export interface AdminOrderListResponse {
  items: Array<{
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: string;
    createdAt: string;
    updatedAt: string;
    customer: {
      id: string;
      name: string;
      email: string;
    };
    payment: {
      id: string;
      status: string;
      provider: string;
    } | null;
  }>;
}

export async function listAdminOrders() {
  return authGet<AdminOrderListResponse>("/api/v1/admin/orders");
}

export async function updateAdminOrderStatus(orderId: string, status: string) {
  return authPatch<{
    message: string;
    order: {
      id: string;
      orderNumber: string;
      status: string;
      updatedAt: string;
    };
  }>(`/api/v1/admin/orders/${encodeURIComponent(orderId)}/status`, { status });
}

export interface AdminCustomerListResponse {
  items: Array<{
    id: string;
    name: string;
    email: string;
    phone: string | null;
    status: string;
    createdAt: string;
    lastLoginAt: string | null;
    totalOrders: number;
    totalPayments: number;
  }>;
}

export async function listAdminCustomers() {
  return authGet<AdminCustomerListResponse>("/api/v1/admin/customers");
}

export interface AdminSalesReportResponse {
  period: "daily" | "monthly";
  items: Array<{
    label: string;
    totalRevenue: string;
    totalOrders: number;
  }>;
}

export async function getAdminSalesReport(period: "daily" | "monthly") {
  return authGet<AdminSalesReportResponse>(`/api/v1/admin/reports/sales?period=${period}`);
}
