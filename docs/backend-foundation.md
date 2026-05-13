# Backend Foundation

## Purpose

Fondasi backend ini menyiapkan struktur awal untuk API e-commerce berbasis Express + Prisma
yang nanti akan dipakai oleh modul auth, katalog, cart, checkout, payment, dan admin.

## Modules

- `apps/backend/src/config`
  Konfigurasi Express app dan validasi environment.
- `apps/backend/src/routes/v1`
  Entry point REST API versi pertama.
- `apps/backend/src/lib/prisma.ts`
  Singleton Prisma client untuk dipakai service dan repository layer.
- `prisma/schema.prisma`
  Sumber utama model domain e-commerce.

## Initial API Shape

- `GET /health`
- `GET /api/v1/auth/status`
- `GET /api/v1/catalog/status`
- `GET /api/v1/orders/status`

## Environment Variables

Lihat `apps/backend/.env.example` untuk variabel minimum:

- `PORT`
- `APP_ORIGIN`
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `MIDTRANS_SERVER_KEY`
- `XENDIT_SECRET_KEY`
- `CLOUDINARY_*`

## Domain Coverage

Schema Prisma sudah mencakup:

- `User`
- `Category`
- `Product`
- `Address`
- `Cart`
- `CartItem`
- `Order`
- `OrderItem`
- `Payment`

## Next Recommended Steps

- generate Prisma client
- tambah migration pertama
- implement auth module
- implement product/category read endpoints
