import { Product, ProductCategory } from "@/types/catalog";

export const productCategories: ProductCategory[] = [
  "Backpacks",
  "Outerwear",
  "Camp Kitchen",
  "Shelter",
  "Accessories"
];

export const products: Product[] = [
  {
    id: "ridgepack-35l",
    name: "RidgePack 35L",
    category: "Backpacks",
    price: 1249000,
    rating: 4.8,
    reviews: 126,
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80",
    tag: "Best Seller",
    description: "Tas gunung serbaguna dengan akses cepat, frame ringan, dan kompartemen hidrasi.",
    colors: ["Stone", "Forest", "Clay"],
    inStock: true
  },
  {
    id: "trailshell-jacket",
    name: "TrailShell Jacket",
    category: "Outerwear",
    price: 899000,
    rating: 4.7,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=80",
    tag: "Trail Tested",
    description: "Jaket pelindung angin dan gerimis dengan potongan ringkas untuk layering.",
    colors: ["Basalt", "Moss"],
    inStock: true
  },
  {
    id: "summit-cup-set",
    name: "Summit Cup Set",
    category: "Camp Kitchen",
    price: 329000,
    rating: 4.6,
    reviews: 54,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    tag: "New Arrival",
    description: "Set mug dan wadah minum untuk kopi pagi di camp dengan material tahan panas.",
    colors: ["Ash", "Ochre"],
    inStock: true
  },
  {
    id: "halcyon-tarp",
    name: "Halcyon Tarp",
    category: "Shelter",
    price: 1499000,
    rating: 4.9,
    reviews: 43,
    image:
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=900&q=80",
    tag: "Limited Drop",
    description: "Tarp modular untuk basecamp cepat dengan coverage luas dan setup fleksibel.",
    colors: ["Khaki", "Slate"],
    inStock: false
  },
  {
    id: "camp-lantern-mini",
    name: "Camp Lantern Mini",
    category: "Accessories",
    price: 459000,
    rating: 4.5,
    reviews: 67,
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80",
    tag: "Best Seller",
    description: "Lampu camp ringkas dengan cahaya hangat untuk tenda, dapur, atau meja packing.",
    colors: ["Sand", "Graphite"],
    inStock: true
  },
  {
    id: "mesa-rolltop",
    name: "Mesa Rolltop",
    category: "Backpacks",
    price: 1099000,
    rating: 4.7,
    reviews: 74,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    tag: "Trail Tested",
    description: "Backpack rolltop dengan sistem kompresi samping untuk trip pendek yang cepat.",
    colors: ["Rust", "Pine"],
    inStock: true
  }
];

export function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(price);
}

export function getFeaturedProducts(limit = 3) {
  return products.slice(0, limit);
}

export function getProductsByCategory(category?: string) {
  if (!category || category === "All") {
    return products;
  }

  return products.filter((product) => product.category === category);
}
