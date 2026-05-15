import type { Request, Response } from "express";

import { catalogService } from "./catalog.service.js";
import {
  categoryParamsSchema,
  createCategorySchema,
  createProductSchema,
  getProductBySlugParamsSchema,
  listCategoriesQuerySchema,
  listProductsQuerySchema,
  productParamsSchema,
  updateCategorySchema,
  updateProductSchema
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

export async function createCategory(request: Request, response: Response) {
  const input = createCategorySchema.parse(request.body);
  const result = await catalogService.createCategory(input);

  response.status(201).json({ item: result });
}

export async function updateCategory(request: Request, response: Response) {
  const params = categoryParamsSchema.parse(request.params);
  const input = updateCategorySchema.parse(request.body);
  const result = await catalogService.updateCategory(params, input);

  response.status(200).json({ item: result });
}

export async function deleteCategory(request: Request, response: Response) {
  const params = categoryParamsSchema.parse(request.params);
  const result = await catalogService.deleteCategory(params);

  response.status(200).json(result);
}

export async function createProduct(request: Request, response: Response) {
  const input = createProductSchema.parse(request.body);
  const result = await catalogService.createProduct(input);

  response.status(201).json({ item: result });
}

export async function updateProduct(request: Request, response: Response) {
  const params = productParamsSchema.parse(request.params);
  const input = updateProductSchema.parse(request.body);
  const result = await catalogService.updateProduct(params, input);

  response.status(200).json({ item: result });
}

export async function deleteProduct(request: Request, response: Response) {
  const params = productParamsSchema.parse(request.params);
  const result = await catalogService.deleteProduct(params);

  response.status(200).json(result);
}
