import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import {
  getAdminOverview,
  getAdminSalesReport,
  listAdminCustomers,
  listAdminOrders,
  updateAdminOrderStatus
} from "../../modules/admin/admin.controller.js";

export const adminRouter = Router();

adminRouter.get("/overview", asyncHandler(getAdminOverview));
adminRouter.get("/orders", asyncHandler(listAdminOrders));
adminRouter.patch("/orders/:orderId/status", asyncHandler(updateAdminOrderStatus));
adminRouter.get("/customers", asyncHandler(listAdminCustomers));
adminRouter.get("/reports/sales", asyncHandler(getAdminSalesReport));
