import type { Request, Response } from "express";

import { catalogService } from "./catalog.service.js";
import {
  getProductBySlugParamsSchema,
  listCategoriesQuerySchema,
  listProductsQuerySchema
} from "./catalog.schemas.js";

export async function getCatalogStatus(_request: Request, response: Response) {
  const result = await catalogService.getStatus();

  response.status(200).json(result);
}

export async function listCategories(request: Request, response: Response) {
  const query = listCategoriesQuerySchema.parse(request.query);
  const result = await catalogService.listCategories(query);

  response.status(200).json({
    items: result
  });
}

export async function listProducts(request: Request, response: Response) {
  const query = listProductsQuerySchema.parse(request.query);
  const result = await catalogService.listProducts(query);

  response.status(200).json(result);
}

export async function getProductBySlug(request: Request, response: Response) {
  const params = getProductBySlugParamsSchema.parse(request.params);
  const result = await catalogService.getProductBySlug(params);

  response.status(200).json({
    item: result
  });
}
