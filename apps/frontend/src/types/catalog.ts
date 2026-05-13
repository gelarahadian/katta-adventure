export type ProductCategory =
  | "Backpacks"
  | "Outerwear"
  | "Camp Kitchen"
  | "Shelter"
  | "Accessories";

export type ProductTag = "Best Seller" | "New Arrival" | "Limited Drop" | "Trail Tested";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  tag: ProductTag;
  description: string;
  colors: string[];
  inStock: boolean;
}
