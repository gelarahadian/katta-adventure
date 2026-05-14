export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  productCount: number;
}

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string | null;
  description: string | null;
  imageUrl: string | null;
  status: string;
  price: string;
  compareAtPrice: string | null;
  stock: number;
  weightGrams: number | null;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CatalogProductsResponse {
  items: CatalogProduct[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
