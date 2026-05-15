import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import {
  createOrder,
  getOrderDetail,
  getOrderPaymentStatus,
  getOrderStatus,
  listOrders,
  midtransWebhook
} from "../../modules/order/order.controller.js";

export const orderRouter = Router();

orderRouter.get("/status", asyncHandler(getOrderStatus));
orderRouter.get("/", asyncHandler(listOrders));
orderRouter.get("/:orderNumber/status", asyncHandler(getOrderPaymentStatus));
orderRouter.get("/:orderNumber", asyncHandler(getOrderDetail));
orderRouter.post("/midtrans/webhook", asyncHandler(midtransWebhook));
orderRouter.post("/", asyncHandler(createOrder));
