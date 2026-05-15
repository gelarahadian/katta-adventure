"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: string;
  stock: number;
  category: {
    id: string;
    name: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function ProductManagement() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "" });
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    sku: "",
    price: "",
    stock: "",
    categoryId: ""
  });

  async function request(path: string, init?: RequestInit) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      },
      cache: "no-store"
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(payload?.message ?? "Request failed");
    }

    return response.json();
  }

  async function loadData() {
    setLoading(true);
    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        request("/api/v1/catalog/categories"),
        request("/api/v1/catalog/products?status=ACTIVE&page=1&pageSize=50")
      ]);

      setCategories(categoriesResponse.items);
      setProducts(productsResponse.items);
      if (!productForm.categoryId && categoriesResponse.items[0]) {
        setProductForm((prev) => ({ ...prev, categoryId: categoriesResponse.items[0].id }));
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memuat data produk");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function createCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await request("/api/v1/catalog/categories", {
        method: "POST",
        body: JSON.stringify({
          name: categoryForm.name,
          slug: categoryForm.slug
        })
      });
      setCategoryForm({ name: "", slug: "" });
      toast.success("Kategori berhasil dibuat");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal membuat kategori");
    }
  }

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await request("/api/v1/catalog/products", {
        method: "POST",
        body: JSON.stringify({
          name: productForm.name,
          slug: productForm.slug,
          sku: productForm.sku,
          price: Number(productForm.price),
          stock: Number(productForm.stock),
          categoryId: productForm.categoryId
        })
      });
      setProductForm((prev) => ({ ...prev, name: "", slug: "", sku: "", price: "", stock: "" }));
      toast.success("Produk berhasil dibuat");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal membuat produk");
    }
  }

  async function deleteProduct(productId: string) {
    try {
      await request(`/api/v1/catalog/products/${productId}`, {
        method: "DELETE"
      });
      toast.success("Produk berhasil dihapus");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus produk");
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Memuat product management...</p>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-border/70 bg-white/80 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Tambah kategori</h3>
        <form className="mt-4 grid gap-3 sm:grid-cols-3" onSubmit={createCategory}>
          <input
            className="h-10 rounded-md border border-border bg-white px-3 text-sm"
            placeholder="Nama kategori"
            value={categoryForm.name}
            onChange={(event) => setCategoryForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <input
            className="h-10 rounded-md border border-border bg-white px-3 text-sm"
            placeholder="Slug"
            value={categoryForm.slug}
            onChange={(event) => setCategoryForm((prev) => ({ ...prev, slug: event.target.value }))}
            required
          />
          <Button type="submit">Tambah kategori</Button>
        </form>
      </section>

      <section className="rounded-lg border border-border/70 bg-white/80 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Tambah produk</h3>
        <form className="mt-4 grid gap-3 sm:grid-cols-3" onSubmit={createProduct}>
          <input
            className="h-10 rounded-md border border-border bg-white px-3 text-sm"
            placeholder="Nama produk"
            value={productForm.name}
            onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <input
            className="h-10 rounded-md border border-border bg-white px-3 text-sm"
            placeholder="Slug"
            value={productForm.slug}
            onChange={(event) => setProductForm((prev) => ({ ...prev, slug: event.target.value }))}
            required
          />
          <input
            className="h-10 rounded-md border border-border bg-white px-3 text-sm"
            placeholder="SKU"
            value={productForm.sku}
            onChange={(event) => setProductForm((prev) => ({ ...prev, sku: event.target.value }))}
            required
          />
          <input
            className="h-10 rounded-md border border-border bg-white px-3 text-sm"
            placeholder="Harga"
            type="number"
            value={productForm.price}
            onChange={(event) => setProductForm((prev) => ({ ...prev, price: event.target.value }))}
            required
          />
          <input
            className="h-10 rounded-md border border-border bg-white px-3 text-sm"
            placeholder="Stock"
            type="number"
            value={productForm.stock}
            onChange={(event) => setProductForm((prev) => ({ ...prev, stock: event.target.value }))}
            required
          />
          <select
            className="h-10 rounded-md border border-border bg-white px-3 text-sm"
            value={productForm.categoryId}
            onChange={(event) => setProductForm((prev) => ({ ...prev, categoryId: event.target.value }))}
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <Button type="submit" className="sm:col-span-3">
            Tambah produk
          </Button>
        </form>
      </section>

      <section className="rounded-lg border border-border/70 bg-white/80 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Daftar produk aktif</h3>
        <div className="mt-4 space-y-3">
          {products.map((product) => (
            <article key={product.id} className="rounded-md border border-border/60 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.category.name} - {product.sku} - Stock {product.stock}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-foreground">Rp {Number(product.price).toLocaleString("id-ID")}</p>
                  <Button variant="outline" size="sm" onClick={() => void deleteProduct(product.id)}>
                    Hapus
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
