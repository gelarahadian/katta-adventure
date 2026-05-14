import type { CreateOrderPayload, CreateOrderResponse } from "@/types/checkout";

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
