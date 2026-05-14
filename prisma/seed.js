const { PrismaClient, ProductStatus } = require("@prisma/client");

const prisma = new PrismaClient();

const categories = [
  {
    name: "Backpacks",
    slug: "backpacks",
    description: "Tas gunung dan daypack untuk perjalanan outdoor."
  },
  {
    name: "Outerwear",
    slug: "outerwear",
    description: "Jaket dan layer pelindung untuk cuaca tidak menentu."
  },
  {
    name: "Camp Kitchen",
    slug: "camp-kitchen",
    description: "Peralatan masak ringkas untuk kebutuhan camp."
  },
  {
    name: "Shelter",
    slug: "shelter",
    description: "Tenda, tarp, dan perlengkapan perlindungan di alam."
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Aksesori pelengkap untuk perjalanan outdoor."
  }
];

const products = [
  {
    name: "RidgePack 35L",
    slug: "ridgepack-35l",
    sku: "KA-BP-001",
    shortDescription: "Tas gunung serbaguna dengan kompartemen hidrasi.",
    description: "Backpack 35L dengan frame ringan dan akses cepat untuk hiking harian.",
    imageUrl:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80",
    status: ProductStatus.ACTIVE,
    price: "1249000",
    compareAtPrice: "1399000",
    stock: 23,
    weightGrams: 980,
    isFeatured: true,
    categorySlug: "backpacks"
  },
  {
    name: "TrailShell Jacket",
    slug: "trailshell-jacket",
    sku: "KA-OW-001",
    shortDescription: "Jaket pelindung angin dan gerimis.",
    description: "Outer shell breathable untuk layering saat trekking pagi atau cuaca berubah.",
    imageUrl:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=80",
    status: ProductStatus.ACTIVE,
    price: "899000",
    compareAtPrice: null,
    stock: 31,
    weightGrams: 460,
    isFeatured: true,
    categorySlug: "outerwear"
  },
  {
    name: "Summit Cup Set",
    slug: "summit-cup-set",
    sku: "KA-CK-001",
    shortDescription: "Set mug dan wadah minum tahan panas.",
    description: "Camp kitchen set ringkas untuk kopi pagi dan meal prep ringan di camp.",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    status: ProductStatus.ACTIVE,
    price: "329000",
    compareAtPrice: null,
    stock: 54,
    weightGrams: 320,
    isFeatured: false,
    categorySlug: "camp-kitchen"
  },
  {
    name: "Halcyon Tarp",
    slug: "halcyon-tarp",
    sku: "KA-SH-001",
    shortDescription: "Tarp modular untuk basecamp cepat.",
    description: "Tarp tahan cuaca dengan coverage luas dan opsi setup fleksibel.",
    imageUrl:
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=900&q=80",
    status: ProductStatus.ACTIVE,
    price: "1499000",
    compareAtPrice: "1699000",
    stock: 0,
    weightGrams: 1800,
    isFeatured: false,
    categorySlug: "shelter"
  },
  {
    name: "Camp Lantern Mini",
    slug: "camp-lantern-mini",
    sku: "KA-AC-001",
    shortDescription: "Lampu camp ringkas dengan cahaya hangat.",
    description: "Lantern mini untuk tenda, meja packing, dan kegiatan malam hari.",
    imageUrl:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80",
    status: ProductStatus.ACTIVE,
    price: "459000",
    compareAtPrice: null,
    stock: 48,
    weightGrams: 240,
    isFeatured: true,
    categorySlug: "accessories"
  }
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        isActive: true
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        isActive: true
      }
    });
  }

  for (const product of products) {
    const category = await prisma.category.findUnique({
      where: { slug: product.categorySlug },
      select: { id: true }
    });

    if (!category) {
      throw new Error(`Category not found for slug: ${product.categorySlug}`);
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        sku: product.sku,
        shortDescription: product.shortDescription,
        description: product.description,
        imageUrl: product.imageUrl,
        status: product.status,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: product.stock,
        weightGrams: product.weightGrams,
        isFeatured: product.isFeatured,
        categoryId: category.id
      },
      create: {
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        shortDescription: product.shortDescription,
        description: product.description,
        imageUrl: product.imageUrl,
        status: product.status,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: product.stock,
        weightGrams: product.weightGrams,
        isFeatured: product.isFeatured,
        categoryId: category.id
      }
    });
  }

  console.log(`Seeded ${categories.length} categories and ${products.length} products`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
