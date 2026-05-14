import { env } from "../../config/env.js";
import { AppError } from "../../lib/app-error.js";

interface MidtransCreateTransactionInput {
  orderNumber: string;
  grossAmount: number;
  customer: {
    firstName: string;
    email: string;
    phone: string;
  };
}

interface MidtransCreateTransactionResult {
  token: string;
  redirectUrl: string;
  raw: unknown;
}

function getMidtransBaseUrl() {
  const key = env.MIDTRANS_SERVER_KEY;
  if (!key) {
    throw new AppError("Midtrans is not configured", 500);
  }

  return env.MIDTRANS_IS_PRODUCTION
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";
}

export async function createMidtransSnapTransaction(input: MidtransCreateTransactionInput) {
  const serverKey = env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    throw new AppError("Midtrans is not configured", 500);
  }

  const response = await fetch(getMidtransBaseUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: input.orderNumber,
        gross_amount: Math.round(input.grossAmount)
      },
      customer_details: {
        first_name: input.customer.firstName,
        email: input.customer.email,
        phone: input.customer.phone
      }
    })
  });

  if (!response.ok) {
    let message = "Failed to create Midtrans transaction";
    let details: unknown = undefined;
    try {
      const payload = (await response.json()) as { status_message?: string };
      details = payload;
      if (payload.status_message) {
        message = payload.status_message;
      }
    } catch (error) {
      details = {
        parseError: error instanceof Error ? error.message : "unknown",
        fallbackText: await response.text().catch(() => "unavailable")
      };
    }

    throw new AppError(message, 502, {
      midtransStatus: response.status,
      endpoint: getMidtransBaseUrl(),
      isProduction: env.MIDTRANS_IS_PRODUCTION,
      keyPrefix: serverKey.slice(0, 10),
      details
    });
  }

  const data = (await response.json()) as {
    token: string;
    redirect_url: string;
  };

  return {
    token: data.token,
    redirectUrl: data.redirect_url,
    raw: data
  } satisfies MidtransCreateTransactionResult;
}
