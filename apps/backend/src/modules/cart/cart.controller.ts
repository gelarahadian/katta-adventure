import type { Request, Response } from "express";

import { cartService } from "./cart.service.js";
import { addCartItemSchema, cartItemParamsSchema, updateCartItemSchema } from "./cart.schemas.js";

export async function getActiveCart(_request: Request, response: Response) {
  const result = await cartService.getActiveCart();
  response.status(200).json(result);
}

export async function addCartItem(request: Request, response: Response) {
  const input = addCartItemSchema.parse(request.body);
  const result = await cartService.addItem(input);
  response.status(200).json(result);
}

export async function updateCartItem(request: Request, response: Response) {
  const params = cartItemParamsSchema.parse(request.params);
  const input = updateCartItemSchema.parse(request.body);
  const result = await cartService.updateItem(params.itemId, input);
  response.status(200).json(result);
}

export async function removeCartItem(request: Request, response: Response) {
  const params = cartItemParamsSchema.parse(request.params);
  const result = await cartService.removeItem(params.itemId);
  response.status(200).json(result);
}
