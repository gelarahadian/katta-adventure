import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { formatPrice } from "@/data/products";
import { Product } from "@/types/catalog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border/70 bg-white/80 shadow-[0_12px_40px_-28px_rgba(35,56,42,0.5)] backdrop-blur-sm">
      <Link href={`/products/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            {product.tag ? (
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {product.tag}
              </p>
            ) : null}
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
              <Link href={`/products/${product.id}`} className="hover:text-primary">
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{product.category}</p>
          </div>
          {typeof product.rating === "number" ? (
            <div className="flex items-center gap-1 rounded-full bg-[#edf4ee] px-2.5 py-1 text-xs font-medium text-foreground">
              <Star className="h-3.5 w-3.5 fill-current text-primary" />
              <span>{product.rating}</span>
            </div>
          ) : null}
        </div>

        {!compact ? (
          <p className="mt-4 text-sm leading-6 text-muted-foreground">{product.description}</p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          {(product.colors ?? []).map((color) => (
            <span
              key={color}
              className="rounded-full border border-border/80 px-2.5 py-1 text-xs text-muted-foreground"
            >
              {color}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <div>
            <p className="text-lg font-semibold text-foreground">{formatPrice(product.price)}</p>
            {typeof product.reviews === "number" ? (
              <p className="text-xs text-muted-foreground">{product.reviews} reviews</p>
            ) : null}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2">
            <Button asChild size={compact ? "sm" : "default"} variant="outline" className="w-full">
              <Link href={`/products/${product.id}`}>Details</Link>
            </Button>
            <Button
              size={compact ? "sm" : "default"}
              variant={product.inStock ? "default" : "secondary"}
              className={cn("w-full", !product.inStock && "text-muted-foreground")}
            >
              {product.inStock ? "Add to cart" : "Notify me"}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
