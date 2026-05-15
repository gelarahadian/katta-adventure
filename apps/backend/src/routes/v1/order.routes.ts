import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { requireAuth } from "../../middlewares/require-auth.js";
import {
  createAddress,
  createOrder,
  getOrderDetail,
  getOrderPaymentStatus,
  getOrderStatus,
  listAddresses,
  listOrders,
  midtransWebhook
} from "../../modules/order/order.controller.js";

export const orderRouter = Router();

orderRouter.get("/status", asyncHandler(getOrderStatus));
orderRouter.get("/addresses", requireAuth, asyncHandler(listAddresses));
orderRouter.post("/addresses", requireAuth, asyncHandler(createAddress));
orderRouter.get("/", requireAuth, asyncHandler(listOrders));
orderRouter.get("/:orderNumber/status", requireAuth, asyncHandler(getOrderPaymentStatus));
orderRouter.get("/:orderNumber", requireAuth, asyncHandler(getOrderDetail));
orderRouter.post("/midtrans/webhook", asyncHandler(midtransWebhook));
orderRouter.post("/", requireAuth, asyncHandler(createOrder));
