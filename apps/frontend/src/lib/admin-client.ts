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
    return new Error(payload.message ?? `Admin request failed (${response.status})`);
  } catch {
    return new Error(`Admin request failed (${response.status})`);
  }
}

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
  const response = await fetch(`${getApiBaseUrl()}/api/v1/admin/overview`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as AdminOverviewResponse;
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
  const response = await fetch(`${getApiBaseUrl()}/api/v1/admin/orders`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as AdminOrderListResponse;
}

export async function updateAdminOrderStatus(orderId: string, status: string) {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/admin/orders/${encodeURIComponent(orderId)}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as {
    message: string;
    order: {
      id: string;
      orderNumber: string;
      status: string;
      updatedAt: string;
    };
  };
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
  const response = await fetch(`${getApiBaseUrl()}/api/v1/admin/customers`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as AdminCustomerListResponse;
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
  const response = await fetch(`${getApiBaseUrl()}/api/v1/admin/reports/sales?period=${period}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as AdminSalesReportResponse;
}
