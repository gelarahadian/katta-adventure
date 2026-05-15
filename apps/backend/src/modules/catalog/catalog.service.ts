import { Prisma, ProductStatus } from "@prisma/client";

import { AppError } from "../../lib/app-error.js";
import { prisma } from "../../lib/prisma.js";

import type {
  CategoryParams,
  CreateCategoryInput,
  CreateProductInput,
  GetProductBySlugParams,
  ListCategoriesQuery,
  ListProductsQuery,
  ProductParams,
  UpdateCategoryInput,
  UpdateProductInput
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

  async createCategory(input: CreateCategoryInput) {
    const category = await prisma.category.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        imageUrl: input.imageUrl,
        isActive: input.isActive
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return category;
  }

  async updateCategory(params: CategoryParams, input: UpdateCategoryInput) {
    const existing = await prisma.category.findUnique({
      where: { id: params.categoryId },
      select: { id: true }
    });

    if (!existing) {
      throw new AppError("Category not found", 404);
    }

    return prisma.category.update({
      where: {
        id: params.categoryId
      },
      data: input,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        isActive: true,
        updatedAt: true
      }
    });
  }

  async deleteCategory(params: CategoryParams) {
    const existing = await prisma.category.findUnique({
      where: { id: params.categoryId },
      include: { _count: { select: { products: true } } }
    });

    if (!existing) {
      throw new AppError("Category not found", 404);
    }

    if (existing._count.products > 0) {
      throw new AppError("Cannot delete category with products", 422);
    }

    await prisma.category.delete({
      where: {
        id: params.categoryId
      }
    });

    return { message: "Category deleted" };
  }

  async createProduct(input: CreateProductInput) {
    const category = await prisma.category.findUnique({
      where: { id: input.categoryId },
      select: { id: true }
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const product = await prisma.product.create({
      data: {
        name: input.name,
        slug: input.slug,
        sku: input.sku,
        shortDescription: input.shortDescription,
        description: input.description,
        imageUrl: input.imageUrl,
        status: input.status,
        price: input.price,
        compareAtPrice: input.compareAtPrice,
        stock: input.stock,
        weightGrams: input.weightGrams,
        isFeatured: input.isFeatured,
        categoryId: input.categoryId
      },
      select: productSelect()
    });

    return serializeProduct(product);
  }

  async updateProduct(params: ProductParams, input: UpdateProductInput) {
    const existing = await prisma.product.findUnique({
      where: { id: params.productId },
      select: { id: true }
    });

    if (!existing) {
      throw new AppError("Product not found", 404);
    }

    if (input.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: input.categoryId },
        select: { id: true }
      });

      if (!category) {
        throw new AppError("Category not found", 404);
      }
    }

    const product = await prisma.product.update({
      where: {
        id: params.productId
      },
      data: input,
      select: productSelect()
    });

    return serializeProduct(product);
  }

  async deleteProduct(params: ProductParams) {
    const existing = await prisma.product.findUnique({
      where: { id: params.productId },
      select: { id: true }
    });

    if (!existing) {
      throw new AppError("Product not found", 404);
    }

    await prisma.product.delete({
      where: {
        id: params.productId
      }
    });

    return {
      message: "Product deleted"
    };
  }
}

export const catalogService = new CatalogService();
