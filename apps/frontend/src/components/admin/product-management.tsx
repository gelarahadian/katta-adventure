"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { authDelete, authGet, authPatch, authPost } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

interface CategoryItem {
  id: string;
  name: string;
}

interface ProductItem {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: number;
  category: {
    id: string;
    name: string;
  };
}

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export function ProductManagement() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "" });
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    sku: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: ""
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        authGet<{ items: CategoryItem[] }>("/api/v1/catalog/categories"),
        authGet<{ items: ProductItem[] }>("/api/v1/catalog/products?status=ACTIVE&page=1&pageSize=50")
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
      await authPost<{ item: CategoryItem }>("/api/v1/catalog/categories", {
        name: categoryForm.name,
        slug: categoryForm.slug
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
      await authPost<{ item: ProductItem }>("/api/v1/catalog/products", {
        name: productForm.name,
        slug: productForm.slug,
        sku: productForm.sku,
        description: productForm.description || undefined,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        categoryId: productForm.categoryId || categories[0]?.id,
        imageUrl: productForm.imageUrl || undefined
      });
      setProductForm((prev) => ({
        ...prev,
        name: "",
        slug: "",
        sku: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: ""
      }));
      toast.success("Produk berhasil dibuat");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal membuat produk");
    }
  }

  async function uploadImage(file: File) {
    if (!CLOUDINARY_UPLOAD_PRESET || !CLOUDINARY_CLOUD_NAME) {
      throw new Error(
        "Cloudinary belum dikonfigurasi. Isi NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME dan NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET di apps/frontend/.env"
      );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Upload gambar gagal");
    }

    const payload = (await response.json()) as { secure_url: string };
    return payload.secure_url;
  }

  async function deleteProduct(productId: string) {
    try {
      await authDelete<{ message: string }>(`/api/v1/catalog/products/${productId}`);
      toast.success("Produk berhasil dihapus");
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus produk");
    }
  }

  async function updateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingProductId) {
      return;
    }

    try {
      await authPatch<{ item: ProductItem }>(`/api/v1/catalog/products/${editingProductId}`, {
        name: productForm.name,
        slug: productForm.slug,
        sku: productForm.sku,
        description: productForm.description || undefined,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        categoryId: productForm.categoryId,
        imageUrl: productForm.imageUrl || undefined
      });
      toast.success("Produk berhasil diperbarui");
      setEditingProductId(null);
      setProductForm((prev) => ({ ...prev, name: "", slug: "", sku: "", description: "", price: "", stock: "", imageUrl: "" }));
      await loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal update produk");
    }
  }

  function startEdit(product: ProductItem) {
    setEditingProductId(product.id);
    setProductForm((prev) => ({
      ...prev,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      description: "",
      price: String(Number(product.price)),
      stock: String(product.stock),
      categoryId: product.category.id
    }));
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Memuat product management...</p>;
  }

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function generateSku(name: string) {
    const prefix = slugify(name)
      .split("-")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 4)
      .padEnd(2, "X");
    const random = Math.floor(1000 + Math.random() * 9000);
    return `KA-${prefix}-${random}`;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-border/70 bg-white/80 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Tambah kategori</h3>
        <form className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={createCategory}>
          <input
            className="h-10 rounded-md border border-border bg-white px-3 text-sm"
            placeholder="Nama kategori"
            value={categoryForm.name}
            onChange={(event) =>
              setCategoryForm((prev) => ({
                ...prev,
                name: event.target.value,
                slug: slugify(event.target.value)
              }))
            }
            required
          />
          <Button type="submit">Tambah kategori</Button>
        </form>
      </section>

      {!editingProductId ? (
        <section className="rounded-lg border border-border/70 bg-white/80 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Tambah produk</h3>
          <form className="mt-4 grid gap-3 sm:grid-cols-3" onSubmit={createProduct}>
          <input
            className="h-10 rounded-md border border-border bg-white px-3 text-sm"
            placeholder="Nama produk"
            value={productForm.name}
            onChange={(event) => {
              const name = event.target.value;
              setProductForm((prev) => ({
                ...prev,
                name,
                slug: slugify(name),
                sku: prev.sku ? prev.sku : generateSku(name)
              }));
            }}
            required
          />
          <textarea
            className="min-h-24 rounded-md border border-border bg-white px-3 py-2 text-sm sm:col-span-3"
            placeholder="Deskripsi produk"
            value={productForm.description}
            onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))}
          />
          <input className="h-10 rounded-md border border-border bg-white px-3 text-sm" placeholder="Harga" type="number" value={productForm.price} onChange={(event) => setProductForm((prev) => ({ ...prev, price: event.target.value }))} required />
          <input className="h-10 rounded-md border border-border bg-white px-3 text-sm" placeholder="Stok" type="number" value={productForm.stock} onChange={(event) => setProductForm((prev) => ({ ...prev, stock: event.target.value }))} required />
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
          <input
            type="file"
            accept="image/*"
            className="h-10 rounded-md border border-border bg-white px-3 py-2 text-sm"
            title={
              CLOUDINARY_UPLOAD_PRESET && CLOUDINARY_CLOUD_NAME
                ? "Upload gambar produk"
                : "Cloudinary belum dikonfigurasi di .env frontend"
            }
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setUploadingImage(true);
              try {
                const imageUrl = await uploadImage(file);
                setProductForm((prev) => ({ ...prev, imageUrl }));
                toast.success("Gambar berhasil diupload");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Upload gambar gagal");
              } finally {
                setUploadingImage(false);
              }
            }}
          />
          <input className="h-10 rounded-md border border-border bg-white px-3 text-sm" placeholder="URL gambar (opsional, auto terisi setelah upload)" value={productForm.imageUrl} onChange={(event) => setProductForm((prev) => ({ ...prev, imageUrl: event.target.value }))} />
            <Button type="submit" className="sm:col-span-3" disabled={uploadingImage}>
              {uploadingImage ? "Upload gambar..." : "Tambah produk"}
            </Button>
          </form>
        </section>
      ) : null}

      {editingProductId ? (
        <section className="rounded-lg border border-border/70 bg-white/80 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Edit produk</h3>
          <form className="mt-4 grid gap-3 sm:grid-cols-3" onSubmit={updateProduct}>
            <input
              className="h-10 rounded-md border border-border bg-white px-3 text-sm"
              placeholder="Nama produk"
              value={productForm.name}
              onChange={(event) => {
                const name = event.target.value;
                setProductForm((prev) => ({ ...prev, name, slug: slugify(name) }));
              }}
              required
            />
            <textarea
              className="min-h-24 rounded-md border border-border bg-white px-3 py-2 text-sm sm:col-span-3"
              placeholder="Deskripsi produk"
              value={productForm.description}
              onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))}
            />
            <input className="h-10 rounded-md border border-border bg-white px-3 text-sm" placeholder="Harga" type="number" value={productForm.price} onChange={(event) => setProductForm((prev) => ({ ...prev, price: event.target.value }))} required />
            <input className="h-10 rounded-md border border-border bg-white px-3 text-sm" placeholder="Stok" type="number" value={productForm.stock} onChange={(event) => setProductForm((prev) => ({ ...prev, stock: event.target.value }))} required />
            <select className="h-10 rounded-md border border-border bg-white px-3 text-sm" value={productForm.categoryId} onChange={(event) => setProductForm((prev) => ({ ...prev, categoryId: event.target.value }))} required>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="sm:col-span-3 flex gap-2">
              <Button type="submit">Simpan perubahan</Button>
              <Button type="button" variant="outline" onClick={() => setEditingProductId(null)}>
                Batal
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="rounded-lg border border-border/70 bg-white/80 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Daftar produk aktif</h3>
        <div className="mt-4 space-y-3">
          {products.map((product) => (
            <article key={product.id} className="rounded-md border border-border/60 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.category.name} - {product.sku} - Stok {product.stock}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-foreground">Rp {Number(product.price).toLocaleString("id-ID")}</p>
                  <Button variant="outline" size="sm" onClick={() => startEdit(product)}>
                    Edit
                  </Button>
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
