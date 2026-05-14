import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { createOrder, getOrderStatus } from "../../modules/order/order.controller.js";

export const orderRouter = Router();

orderRouter.get("/status", asyncHandler(getOrderStatus));
orderRouter.post("/", asyncHandler(createOrder));
