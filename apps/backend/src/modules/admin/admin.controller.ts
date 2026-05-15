import type { Request, Response } from "express";

import { adminService } from "./admin.service.js";
import { orderParamsSchema, updateOrderStatusSchema } from "./admin.schemas.js";

export async function getAdminOverview(_request: Request, response: Response) {
  const result = await adminService.getOverview();
  response.status(200).json(result);
}

export async function listAdminOrders(_request: Request, response: Response) {
  const result = await adminService.listOrders();
  response.status(200).json(result);
}

export async function updateAdminOrderStatus(request: Request, response: Response) {
  const params = orderParamsSchema.parse(request.params);
  const input = updateOrderStatusSchema.parse(request.body);
  const result = await adminService.updateOrderStatus(params.orderId, input.status);
  response.status(200).json(result);
}

export async function listAdminCustomers(_request: Request, response: Response) {
  const result = await adminService.listCustomers();
  response.status(200).json(result);
}
