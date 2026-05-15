import type { Request, Response } from "express";

import { cartService } from "./cart.service.js";
import { addCartItemSchema, cartItemParamsSchema, updateCartItemSchema } from "./cart.schemas.js";

export async function getActiveCart(request: Request, response: Response) {
  const result = await cartService.getActiveCart(request.auth!.userId);
  response.status(200).json(result);
}

export async function addCartItem(request: Request, response: Response) {
  const input = addCartItemSchema.parse(request.body);
  const result = await cartService.addItem(request.auth!.userId, input);
  response.status(200).json(result);
}

export async function updateCartItem(request: Request, response: Response) {
  const params = cartItemParamsSchema.parse(request.params);
  const input = updateCartItemSchema.parse(request.body);
  const result = await cartService.updateItem(request.auth!.userId, params.itemId, input);
  response.status(200).json(result);
}

export async function removeCartItem(request: Request, response: Response) {
  const params = cartItemParamsSchema.parse(request.params);
  const result = await cartService.removeItem(request.auth!.userId, params.itemId);
  response.status(200).json(result);
}
