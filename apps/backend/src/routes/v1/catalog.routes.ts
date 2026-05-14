import { Router } from "express";

import {
  getCatalogStatus,
  getProductBySlug,
  listCategories,
  listProducts
} from "../../modules/catalog/catalog.controller.js";

export const catalogRouter = Router();

catalogRouter.get("/status", getCatalogStatus);
catalogRouter.get("/categories", listCategories);
catalogRouter.get("/products", listProducts);
catalogRouter.get("/products/:slug", getProductBySlug);
