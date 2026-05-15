import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getCatalogStatus,
  getProductBySlug,
  listCategories,
  listProducts,
  updateCategory,
  updateProduct
} from "../../modules/catalog/catalog.controller.js";

export const catalogRouter = Router();

catalogRouter.get("/status", asyncHandler(getCatalogStatus));
catalogRouter.get("/categories", asyncHandler(listCategories));
catalogRouter.post("/categories", asyncHandler(createCategory));
catalogRouter.patch("/categories/:categoryId", asyncHandler(updateCategory));
catalogRouter.delete("/categories/:categoryId", asyncHandler(deleteCategory));
catalogRouter.get("/products", asyncHandler(listProducts));
catalogRouter.post("/products", asyncHandler(createProduct));
catalogRouter.patch("/products/:productId", asyncHandler(updateProduct));
catalogRouter.delete("/products/:productId", asyncHandler(deleteProduct));
catalogRouter.get("/products/:slug", asyncHandler(getProductBySlug));
