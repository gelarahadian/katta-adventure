import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight, ShieldCheck, Star, Truck } from "lucide-react";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/storefront/product-card";
import { SectionHeading } from "@/components/storefront/section-heading";
import { SiteHeader } from "@/components/storefront/site-header";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatPrice } from "@/data/products";
import { getCatalogProductBySlug, getCatalogProducts } from "@/lib/catalog-client";
import { mapCatalogProductToCard } from "@/lib/catalog-mappers";
import { Button } from "@/components/ui/button";

interface ProductDetailPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export async function generateStaticParams() {
  const response = await getCatalogProducts({ page: 1, pageSize: 50, sort: "newest" });
  return response.items.map((product) => ({ productId: product.slug }));
}

export async function generateMetadata({
  params
}: ProductDetailPageProps): Promise<Metadata> {
  const { productId } = await params;
  try {
    const product = await getCatalogProductBySlug(productId);
    return {
      title: `${product.name} | Katta Adventure`,
      description: product.description ?? product.shortDescription ?? "Detail produk Katta Adventure"
    };
  } catch {
    return {
      title: "Product Not Found | Katta Adventure"
    };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { productId } = await params;
  let product;
  try {
    product = await getCatalogProductBySlug(productId);
  } catch {
    notFound();
  }

  const relatedResponse = await getCatalogProducts({
    category: product.category.slug,
    page: 1,
    pageSize: 4,
    sort: "newest"
  });
  const relatedProducts = relatedResponse.items
    .filter((item) => item.slug !== product.slug)
    .slice(0, 3)
    .map(mapCatalogProductToCard);

  return (
    <main className="min-h-screen">
      <SiteHeader currentPath="/products" />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/products" className="hover:text-foreground">
            Products
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden rounded-lg border border-border/70 bg-white/70 shadow-[0_24px_70px_-48px_rgba(30,48,39,0.65)]">
            {product.isFeatured ? (
              <div className="absolute left-5 top-5 z-10 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary backdrop-blur-sm">
                Featured
              </div>
            ) : null}
            <div className="relative aspect-[4/4.3] bg-muted">
              <Image
                src={product.imageUrl ?? "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80"}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 52vw, 100vw"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              {product.category.name}
            </p>
            <h1 className="mt-3 font-serif text-4xl tracking-tight text-foreground sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5">
                <Star className="h-4 w-4 fill-current text-primary" />
                <span className="font-medium text-foreground">Catalog item</span>
                <span>{product.sku}</span>
              </div>
              <div className="rounded-full bg-white/75 px-3 py-1.5">
                {product.stock > 0 ? "Ready stock" : "Limited availability"}
              </div>
            </div>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
              {product.description ?? product.shortDescription ?? "Detail produk belum tersedia."}
            </p>

            <div className="mt-8 rounded-lg border border-border/70 bg-white/70 p-5 backdrop-blur-sm">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                    {formatPrice(Number(product.price))}
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/products">Back to catalog</Link>
                </Button>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                {product.stock > 0 ? (
                  <div className="sm:flex-1">
                    <AddToCartButton productId={product.id} />
                  </div>
                ) : (
                  <Button className="sm:flex-1" variant="secondary" disabled>
                    Notify me
                  </Button>
                )}
                <Button variant="outline" className="sm:flex-1">
                  Save for later
                </Button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border/70 bg-white/60 p-4">
                <div className="flex items-center gap-3 text-foreground">
                  <Truck className="h-5 w-5 text-primary" />
                  <p className="font-medium">Dispatch cepat</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Pengiriman reguler 1-2 hari untuk area urban dan packing terlindungi.
                </p>
              </div>
              <div className="rounded-lg border border-border/70 bg-white/60 p-4">
                <div className="flex items-center gap-3 text-foreground">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <p className="font-medium">Field-ready quality</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Material dipilih untuk pemakaian rutin di trek, camp, dan travel outdoor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="rounded-lg border border-border/70 bg-white/60 p-6 backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Why it works
            </p>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
              <li className="flex gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Desain dibuat untuk packing lebih cepat dan akses gear lebih rapi.
              </li>
              <li className="flex gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Proporsi visual dan struktur konten sudah siap untuk nanti diisi data API nyata.
              </li>
              <li className="flex gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Halaman ini bisa jadi basis untuk variant selector, cart state, dan review module.
              </li>
            </ul>
          </div>

          <div>
            <SectionHeading
              eyebrow="Related gear"
              title="Complete the setup"
              description="Beberapa item lain yang masih nyambung dengan kebutuhan produk ini."
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} compact />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
