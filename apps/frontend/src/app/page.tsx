import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getFeaturedProducts, productCategories } from "@/data/products";
import { FilterChip } from "@/components/storefront/filter-chip";
import { ProductCard } from "@/components/storefront/product-card";
import { SectionHeading } from "@/components/storefront/section-heading";
import { SiteHeader } from "@/components/storefront/site-header";
import { Button } from "@/components/ui/button";

export default function Home() {
  const featuredProducts = getFeaturedProducts();

  return (
    <main className="min-h-screen">
      <SiteHeader currentPath="/" />

      <section className="border-b border-border/70">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Outdoor essentials
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-5xl tracking-tight sm:text-6xl">
              Katta Adventure
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Gear pilihan untuk perjalanan gunung, camping, dan eksplorasi akhir pekan dengan kualitas yang siap dipakai lama.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/products">
                  Belanja produk
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="#collections">Jelajahi koleksi</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {productCategories.map((category) => (
                <FilterChip
                  key={category}
                  label={category}
                  href={`/products?category=${encodeURIComponent(category)}`}
                />
              ))}
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-border/70 bg-muted shadow-[0_24px_60px_-40px_rgba(28,49,38,0.55)] sm:min-h-[460px]">
            <Image
              src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80"
              alt="Mountain adventure trail"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 48vw, 100vw"
            />
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Produk unggulan"
            title="Siap untuk rute berikutnya"
            description="Pilihan produk unggulan untuk memberi bentuk awal storefront yang lebih realistis dan konsisten."
          />
          <Button variant="secondary" asChild>
            <Link href="/products">Lihat semua</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </section>

      <section
        id="collections"
        className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-3 lg:px-8"
      >
        {[
          "Basecamp wardrobe",
          "Fast-packing setup",
          "Weekend shelter edit"
        ].map((item) => (
          <div
            key={item}
            className="rounded-lg border border-border/70 bg-white/65 p-6 shadow-[0_12px_40px_-28px_rgba(35,56,42,0.4)] backdrop-blur-sm"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Koleksi pilihan
            </p>
            <h3 className="mt-3 font-serif text-2xl tracking-tight">{item}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Kombinasi produk yang disusun untuk kebutuhan perjalanan singkat dengan alur belanja yang lebih fokus.
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
