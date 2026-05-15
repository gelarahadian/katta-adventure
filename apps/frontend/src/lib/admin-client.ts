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
