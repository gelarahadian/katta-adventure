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

export type ListCategoriesQuery = z.infer<typeof listCategoriesQuerySchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
export type GetProductBySlugParams = z.infer<typeof getProductBySlugParamsSchema>;
