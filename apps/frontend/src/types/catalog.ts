export type ProductCategory = string;

export type ProductTag = "Best Seller" | "New Arrival" | "Limited Drop" | "Trail Tested";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  rating?: number;
  reviews?: number;
  image: string;
  tag?: ProductTag | string;
  description: string;
  colors?: string[];
  inStock: boolean;
}
