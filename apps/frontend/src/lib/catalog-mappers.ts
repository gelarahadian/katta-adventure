import type { CatalogProduct } from "@/types/catalog-api";
import type { Product } from "@/types/catalog";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80";

export function mapCatalogProductToCard(product: CatalogProduct): Product {
  return {
    id: product.slug,
    name: product.name,
    category: product.category.name,
    price: Number(product.price),
    image: product.imageUrl ?? FALLBACK_IMAGE,
    description: product.shortDescription ?? product.description ?? "Produk outdoor berkualitas.",
    inStock: product.stock > 0,
    tag: product.isFeatured ? "Best Seller" : undefined
  };
}
