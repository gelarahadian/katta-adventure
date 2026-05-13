import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpDown, CheckCircle2, SlidersHorizontal } from "lucide-react";

import { FilterChip } from "@/components/storefront/filter-chip";
import { ProductCard } from "@/components/storefront/product-card";
import { SectionHeading } from "@/components/storefront/section-heading";
import { SiteHeader } from "@/components/storefront/site-header";
import { getProductsByCategory, productCategories } from "@/data/products";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Products | Katta Adventure",
  description: "Catalog produk Katta Adventure untuk kebutuhan gunung, camping, dan travel outdoor."
};

interface ProductsPageProps {
  searchParams?: Promise<{
    category?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedCategory = resolvedSearchParams?.category ?? "All";
  const filteredProducts = getProductsByCategory(selectedCategory);

  return (
    <main className="min-h-screen">
      <SiteHeader currentPath="/products" />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 border-b border-border/70 pb-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <SectionHeading
            eyebrow="Catalog"
            title="Products"
            description="Katalog awal ini sudah disusun dengan struktur reusable, siap diteruskan ke filter interaktif, cart, dan API produk."
          />

          <div className="grid gap-4 rounded-lg border border-border/70 bg-white/70 p-5 backdrop-blur-sm sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Items</p>
              <p className="mt-2 text-2xl font-semibold">{filteredProducts.length}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Stock</p>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Active inventory
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Sort</p>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <ArrowUpDown className="h-4 w-4 text-primary" />
                Featured first
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <FilterChip label="All" href="/products" active={selectedCategory === "All"} />
            {productCategories.map((category) => (
              <FilterChip
                key={category}
                label={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                active={selectedCategory === category}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="justify-start">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            <Button asChild variant="secondary">
              <Link href="/">Back home</Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-lg border border-border/70 bg-white/70 p-6 backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Browse by use
            </p>
            <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
              <li>Summit daypacks for fast movement.</li>
              <li>Layering outerwear for wet trail mornings.</li>
              <li>Compact kitchen gear for quick camp setup.</li>
              <li>Shelter essentials for longer overnight trips.</li>
            </ul>
          </aside>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
