import Link from "next/link";

import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  href: string;
  active?: boolean;
}

export function FilterChip({ label, href, active = false }: FilterChipProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border/80 bg-white/75 text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
}
