import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { requireAuth } from "../../middlewares/require-auth.js";
import {
  addCartItem,
  getActiveCart,
  removeCartItem,
  updateCartItem
} from "../../modules/cart/cart.controller.js";

export const cartRouter = Router();

cartRouter.use(requireAuth);

cartRouter.get("/", asyncHandler(getActiveCart));
cartRouter.post("/items", asyncHandler(addCartItem));
cartRouter.patch("/items/:itemId", asyncHandler(updateCartItem));
cartRouter.delete("/items/:itemId", asyncHandler(removeCartItem));
