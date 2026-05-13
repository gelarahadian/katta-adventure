import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, Search, ShoppingBag, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

const featuredProducts = [
  {
    name: "RidgePack 35L",
    category: "Backpack",
    price: "Rp 1.249.000",
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "TrailShell Jacket",
    category: "Outerwear",
    price: "Rp 899.000",
    image:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Summit Cup Set",
    category: "Camp Kitchen",
    price: "Rp 329.000",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Katta Adventure
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <Link className="hover:text-foreground" href="#products">
              Products
            </Link>
            <Link className="hover:text-foreground" href="#collections">
              Collections
            </Link>
            <Link className="hover:text-foreground" href="#support">
              Support
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" aria-label="Search">
              <Search className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" aria-label="Cart">
              <ShoppingBag className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" className="md:hidden" aria-label="Menu">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Outdoor essentials
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Katta Adventure
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Gear pilihan untuk perjalanan gunung, camping, dan eksplorasi akhir pekan dengan kualitas yang siap dipakai lama.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="#products">
                  Shop products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="#collections">View collections</Link>
              </Button>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-lg border bg-muted sm:min-h-[460px]">
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
          <div>
            <p className="text-sm font-semibold text-primary">Featured gear</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready for the next route
            </h2>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/products">Browse all</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <article key={product.name} className="overflow-hidden rounded-lg border bg-background">
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Star className="h-4 w-4 fill-current" />
                  <span>New arrival</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold">{product.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{product.category}</p>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <p className="font-semibold">{product.price}</p>
                  <Button size="sm" variant="outline">
                    Add
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
