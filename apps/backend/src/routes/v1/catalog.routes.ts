import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import {
  getCatalogStatus,
  getProductBySlug,
  listCategories,
  listProducts
} from "../../modules/catalog/catalog.controller.js";

export const catalogRouter = Router();

catalogRouter.get("/status", asyncHandler(getCatalogStatus));
catalogRouter.get("/categories", asyncHandler(listCategories));
catalogRouter.get("/products", asyncHandler(listProducts));
catalogRouter.get("/products/:slug", asyncHandler(getProductBySlug));
