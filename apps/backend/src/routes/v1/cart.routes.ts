import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import {
  addCartItem,
  getActiveCart,
  removeCartItem,
  updateCartItem
} from "../../modules/cart/cart.controller.js";

export const cartRouter = Router();

cartRouter.get("/", asyncHandler(getActiveCart));
cartRouter.post("/items", asyncHandler(addCartItem));
cartRouter.patch("/items/:itemId", asyncHandler(updateCartItem));
cartRouter.delete("/items/:itemId", asyncHandler(removeCartItem));
