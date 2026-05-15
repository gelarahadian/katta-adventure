import type { Request, Response } from "express";

import { env } from "../../config/env.js";
import { orderService } from "./order.service.js";
import {
  createOrderSchema,
  midtransWebhookSchema,
  orderStatusParamsSchema
} from "./order.schemas.js";

export async function getOrderStatus(_request: Request, response: Response) {
  response.status(200).json({
    module: "orders",
    status: "ready",
    next: ["checkout", "payment", "tracking"]
  });
}

export async function getOrderPaymentStatus(request: Request, response: Response) {
  const params = orderStatusParamsSchema.parse(request.params);
  const result = await orderService.getOrderPaymentStatus(params.orderNumber);

  response.status(200).json(result);
}

export async function listOrders(_request: Request, response: Response) {
  const result = await orderService.listOrders();
  response.status(200).json(result);
}

export async function getOrderDetail(request: Request, response: Response) {
  const params = orderStatusParamsSchema.parse(request.params);
  const result = await orderService.getOrderDetail(params.orderNumber);
  response.status(200).json(result);
}

export async function createOrder(request: Request, response: Response) {
  if (env.NODE_ENV !== "production") {
    console.log("[order:create] midtrans runtime", {
      isProduction: env.MIDTRANS_IS_PRODUCTION,
      serverKeyPrefix: env.MIDTRANS_SERVER_KEY?.slice(0, 12) ?? null,
      serverKeyLength: env.MIDTRANS_SERVER_KEY?.length ?? 0,
      clientKeyPrefix: env.MIDTRANS_CLIENT_KEY?.slice(0, 12) ?? null,
      clientKeyLength: env.MIDTRANS_CLIENT_KEY?.length ?? 0
    });
  }

  const input = createOrderSchema.parse(request.body);
  const result = await orderService.createOrder(input);

  response.status(201).json(result);
}

export async function midtransWebhook(request: Request, response: Response) {
  const payload = midtransWebhookSchema.parse(request.body);
  const result = await orderService.handleMidtransWebhook(payload);

  response.status(200).json(result);
}
