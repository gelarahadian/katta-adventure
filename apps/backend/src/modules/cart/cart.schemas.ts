import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.coerce.number().int().positive().max(99).default(1)
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().positive().max(99)
});

export const cartItemParamsSchema = z.object({
  itemId: z.string().trim().min(1)
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CartItemParams = z.infer<typeof cartItemParamsSchema>;
