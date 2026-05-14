import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpDown, CheckCircle2, SlidersHorizontal } from "lucide-react";

import { FilterChip } from "@/components/storefront/filter-chip";
import { ProductCard } from "@/components/storefront/product-card";
import { SectionHeading } from "@/components/storefront/section-heading";
import { SiteHeader } from "@/components/storefront/site-header";
import { formatPrice } from "@/data/products";
import { getCatalogCategories, getCatalogProducts } from "@/lib/catalog-client";
import { mapCatalogProductToCard } from "@/lib/catalog-mappers";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Products | Katta Adventure",
  description: "Catalog produk Katta Adventure untuk kebutuhan gunung, camping, dan travel outdoor."
};

interface ProductsPageProps {
  searchParams?: Promise<{
    category?: string;
    search?: string;
    sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedCategory = resolvedSearchParams?.category ?? "all";
  const search = resolvedSearchParams?.search?.trim() ?? "";
  const sort = resolvedSearchParams?.sort ?? "newest";

  const [categories, productsResponse] = await Promise.all([
    getCatalogCategories(),
    getCatalogProducts({
      category: selectedCategory === "all" ? undefined : selectedCategory,
      search: search || undefined,
      sort,
      page: 1,
      pageSize: 12
    })
  ]);

  const filteredProducts = productsResponse.items.map(mapCatalogProductToCard);

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
              <p className="mt-2 text-2xl font-semibold">{productsResponse.meta.total}</p>
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
                {sort.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <FilterChip label="All" href="/products" active={selectedCategory === "all"} />
            {categories.map((category) => (
              <FilterChip
                key={category.id}
                label={category.name}
                href={`/products?category=${encodeURIComponent(category.slug)}${search ? `&search=${encodeURIComponent(search)}` : ""}${sort ? `&sort=${encodeURIComponent(sort)}` : ""}`}
                active={selectedCategory === category.slug}
              />
            ))}
          </div>

          <form className="flex items-center gap-3" action="/products" method="get">
            <input type="hidden" name="category" value={selectedCategory} />
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                name="search"
                defaultValue={search}
                placeholder="Cari nama, SKU, slug"
                className="h-10 w-56 rounded-md border border-border bg-white pl-9 pr-3 text-sm outline-none ring-primary/50 placeholder:text-muted-foreground focus:ring-2"
              />
            </div>
            <select
              name="sort"
              defaultValue={sort}
              className="h-10 rounded-md border border-border bg-white px-3 text-sm outline-none ring-primary/50 focus:ring-2"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_asc">Price low-high</option>
              <option value="price_desc">Price high-low</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
            </select>
            <Button type="submit" variant="outline" className="justify-start">
              Apply
            </Button>
            <Button asChild variant="secondary">
              <Link href="/">Back home</Link>
            </Button>
          </form>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-lg border border-border/70 bg-white/70 p-6 backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Filter snapshot
            </p>
            <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
              <li>Category: {selectedCategory === "all" ? "All" : selectedCategory}</li>
              <li>Search: {search || "-"}</li>
              <li>Sort: {sort}</li>
              <li>Total products: {productsResponse.meta.total}</li>
            </ul>
            {filteredProducts[0] ? (
              <p className="mt-6 text-sm font-medium text-foreground">
                Harga mulai {formatPrice(Math.min(...filteredProducts.map((item) => item.price)))}
              </p>
            ) : null}
          </aside>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="rounded-lg border border-border/70 bg-white/70 p-6 text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">
                Produk tidak ditemukan untuk filter ini. Coba ubah kategori atau kata kunci pencarian.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
