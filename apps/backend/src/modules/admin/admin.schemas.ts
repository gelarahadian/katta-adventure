import { OrderStatus } from "@prisma/client";
import { z } from "zod";

export const orderParamsSchema = z.object({
  orderId: z.string().trim().min(1)
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus)
});

export type OrderParamsInput = z.infer<typeof orderParamsSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
