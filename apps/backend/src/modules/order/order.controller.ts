import type { Request, Response } from "express";

import { env } from "../../config/env.js";
import { orderService } from "./order.service.js";
import { createOrderSchema } from "./order.schemas.js";

export async function getOrderStatus(_request: Request, response: Response) {
  response.status(200).json({
    module: "orders",
    status: "ready",
    next: ["checkout", "payment", "tracking"]
  });
}

export async function createOrder(request: Request, response: Response) {
  if (env.NODE_ENV !== "production") {
    console.log("[order:create] midtrans runtime", {
      isProduction: env.MIDTRANS_IS_PRODUCTION,
      serverKeyPrefix: env.MIDTRANS_SERVER_KEY ?? null,
      serverKeyLength: env.MIDTRANS_SERVER_KEY ?? 0,
      clientKeyPrefix: env.MIDTRANS_CLIENT_KEY?.slice(0, 12) ?? null,
      clientKeyLength: env.MIDTRANS_CLIENT_KEY ?? 0
    });
  }

  const input = createOrderSchema.parse(request.body);
  const result = await orderService.createOrder(input);

  response.status(201).json(result);
}
