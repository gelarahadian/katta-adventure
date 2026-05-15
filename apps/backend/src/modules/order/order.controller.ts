import type { Request, Response } from "express";

import { env } from "../../config/env.js";
import { orderService } from "./order.service.js";
import {
  createAddressSchema,
  createOrderSchema,
  listAddressesQuerySchema,
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
  const result = await orderService.getOrderPaymentStatus(request.auth!.userId, params.orderNumber);

  response.status(200).json(result);
}

export async function listOrders(request: Request, response: Response) {
  const result = await orderService.listOrders(request.auth!.userId);
  response.status(200).json(result);
}

export async function getOrderDetail(request: Request, response: Response) {
  const params = orderStatusParamsSchema.parse(request.params);
  const result = await orderService.getOrderDetail(request.auth!.userId, params.orderNumber);
  response.status(200).json(result);
}

export async function listAddresses(request: Request, response: Response) {
  const query = listAddressesQuerySchema.parse(request.query);
  const result = await orderService.listAddresses(request.auth!.userId, query);
  response.status(200).json(result);
}

export async function createAddress(request: Request, response: Response) {
  const input = createAddressSchema.parse(request.body);
  const result = await orderService.createAddress(request.auth!.userId, input);
  response.status(201).json(result);
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
  const result = await orderService.createOrder(request.auth!.userId, input);

  response.status(201).json(result);
}

export async function midtransWebhook(request: Request, response: Response) {
  const payload = midtransWebhookSchema.parse(request.body);
  const result = await orderService.handleMidtransWebhook(payload);

  response.status(200).json(result);
}
