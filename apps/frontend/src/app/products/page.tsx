import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4 border-b pb-6">
        <div>
          <p className="text-sm font-semibold text-primary">Catalog</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Products</h1>
        </div>
        <Button asChild variant="outline">
          <Link href="/">Back home</Link>
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-center py-20 text-center text-muted-foreground">
        Product catalog module is ready for API integration.
      </div>
    </main>
  );
}
