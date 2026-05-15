import { ProductStatus } from "@prisma/client";
import { z } from "zod";

export const listCategoriesQuerySchema = z.object({
  includeInactive: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((value) => value === "true")
});

export const listProductsQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  featured: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((value) => value === "true"),
  status: z.nativeEnum(ProductStatus).optional().default(ProductStatus.ACTIVE),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(12),
  sort: z
    .enum(["newest", "oldest", "price_asc", "price_desc", "name_asc", "name_desc"])
    .default("newest")
});

export const getProductBySlugParamsSchema = z.object({
  slug: z.string().trim().min(1)
});

export const categoryParamsSchema = z.object({
  categoryId: z.string().trim().min(1)
});

export const productParamsSchema = z.object({
  productId: z.string().trim().min(1)
});

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(120),
  description: z.string().trim().max(300).optional(),
  imageUrl: z.string().trim().url().optional(),
  isActive: z.boolean().optional().default(true)
});

export const updateCategorySchema = createCategorySchema.partial();

export const createProductSchema = z.object({
  name: z.string().trim().min(2).max(150),
  slug: z.string().trim().min(2).max(150),
  sku: z.string().trim().min(2).max(80),
  shortDescription: z.string().trim().max(300).optional(),
  description: z.string().trim().max(2000).optional(),
  imageUrl: z.string().trim().url().optional(),
  status: z.nativeEnum(ProductStatus).optional().default(ProductStatus.ACTIVE),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().optional(),
  stock: z.coerce.number().int().nonnegative().default(0),
  weightGrams: z.coerce.number().int().nonnegative().optional(),
  isFeatured: z.boolean().optional().default(false),
  categoryId: z.string().trim().min(1)
});

export const updateProductSchema = createProductSchema.partial();

export type ListCategoriesQuery = z.infer<typeof listCategoriesQuerySchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
export type GetProductBySlugParams = z.infer<typeof getProductBySlugParamsSchema>;
export type CategoryParams = z.infer<typeof categoryParamsSchema>;
export type ProductParams = z.infer<typeof productParamsSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
