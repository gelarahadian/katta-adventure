import type { CatalogCategory, CatalogProduct, CatalogProductsResponse } from "@/types/catalog-api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  return API_BASE_URL;
}

async function request<TResponse>(path: string) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    next: {
      revalidate: 30
    }
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data katalog.");
  }

  return (await response.json()) as TResponse;
}

export async function getCatalogCategories() {
  const response = await request<{ items: CatalogCategory[] }>("/api/v1/catalog/categories");
  return response.items;
}

interface GetCatalogProductsParams {
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
}

export async function getCatalogProducts(params: GetCatalogProductsParams) {
  const query = new URLSearchParams();

  if (params.category) {
    query.set("category", params.category);
  }
  if (params.search) {
    query.set("search", params.search);
  }
  if (params.page) {
    query.set("page", String(params.page));
  }
  if (params.pageSize) {
    query.set("pageSize", String(params.pageSize));
  }
  if (params.sort) {
    query.set("sort", params.sort);
  }

  const suffix = query.toString();
  return request<CatalogProductsResponse>(`/api/v1/catalog/products${suffix ? `?${suffix}` : ""}`);
}

export async function getCatalogProductBySlug(slug: string) {
  const response = await request<{ item: CatalogProduct }>(`/api/v1/catalog/products/${encodeURIComponent(slug)}`);
  return response.item;
}
