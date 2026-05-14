import { Prisma, ProductStatus } from "@prisma/client";

import { AppError } from "../../lib/app-error.js";
import { prisma } from "../../lib/prisma.js";

import type {
  GetProductBySlugParams,
  ListCategoriesQuery,
  ListProductsQuery
} from "./catalog.schemas.js";

function serializeDecimal(value: Prisma.Decimal | null) {
  return value ? value.toString() : null;
}

function productSelect() {
  return {
    id: true,
    name: true,
    slug: true,
    sku: true,
    shortDescription: true,
    description: true,
    imageUrl: true,
    status: true,
    price: true,
    compareAtPrice: true,
    stock: true,
    weightGrams: true,
    isFeatured: true,
    createdAt: true,
    updatedAt: true,
    category: {
      select: {
        id: true,
        name: true,
        slug: true
      }
    }
  } satisfies Prisma.ProductSelect;
}

function serializeProduct(
  product: Prisma.ProductGetPayload<{
    select: ReturnType<typeof productSelect>;
  }>
) {
  return {
    ...product,
    price: product.price.toString(),
    compareAtPrice: serializeDecimal(product.compareAtPrice)
  };
}

function getProductOrderBy(sort: ListProductsQuery["sort"]): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "oldest":
      return { createdAt: "asc" };
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "name_asc":
      return { name: "asc" };
    case "name_desc":
      return { name: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

export class CatalogService {
  async getStatus() {
    return {
      module: "catalog",
      status: "implemented-foundation",
      endpoints: [
        "GET /api/v1/catalog/categories",
        "GET /api/v1/catalog/products",
        "GET /api/v1/catalog/products/:slug"
      ]
    };
  }

  async listCategories(query: ListCategoriesQuery) {
    const categories = await prisma.category.findMany({
      where: query.includeInactive
        ? undefined
        : {
            isActive: true
          },
      orderBy: {
        name: "asc"
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        isActive: true,
        _count: {
          select: {
            products: {
              where: {
                status: ProductStatus.ACTIVE
              }
            }
          }
        }
      }
    });

    return categories.map((category) => ({
      ...category,
      productCount: category._count.products
    }));
  }

  async listProducts(query: ListProductsQuery) {
    const where: Prisma.ProductWhereInput = {
      status: query.status,
      ...(query.search
        ? {
            OR: [
              {
                name: {
                  contains: query.search,
                  mode: "insensitive"
                }
              },
              {
                slug: {
                  contains: query.search,
                  mode: "insensitive"
                }
              },
              {
                sku: {
                  contains: query.search,
                  mode: "insensitive"
                }
              }
            ]
          }
        : {}),
      ...(query.category
        ? {
            category: {
              slug: query.category
            }
          }
        : {}),
      ...(query.featured
        ? {
            isFeatured: true
          }
        : {})
    };

    const [total, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: getProductOrderBy(query.sort),
        select: productSelect()
      })
    ]);

    return {
      items: products.map(serializeProduct),
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.pageSize))
      }
    };
  }

  async getProductBySlug(params: GetProductBySlugParams) {
    const product = await prisma.product.findUnique({
      where: {
        slug: params.slug
      },
      select: productSelect()
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return serializeProduct(product);
  }
}

export const catalogService = new CatalogService();
