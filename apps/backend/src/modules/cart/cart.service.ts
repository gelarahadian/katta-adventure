import { CartStatus, ProductStatus } from "@prisma/client";

import { AppError } from "../../lib/app-error.js";
import { prisma } from "../../lib/prisma.js";

import type { AddCartItemInput, UpdateCartItemInput } from "./cart.schemas.js";

async function getOrCreateActiveCart(userId: string) {

  const existingCart = await prisma.cart.findFirst({
    where: {
      userId,
      status: CartStatus.ACTIVE
    },
    select: { id: true }
  });

  if (existingCart) {
    return existingCart.id;
  }

  const cart = await prisma.cart.create({
    data: {
      userId,
      status: CartStatus.ACTIVE
    },
    select: { id: true }
  });

  return cart.id;
}

function serializeMoney(value: { toString(): string }) {
  return value.toString();
}

async function getCartSummary(cartId: string) {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              imageUrl: true,
              price: true,
              stock: true,
              status: true
            }
          }
        }
      }
    }
  });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const subtotal = cart.items.reduce((total, item) => total + Number(item.unitPrice) * item.quantity, 0);

  return {
    id: cart.id,
    status: cart.status,
    items: cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: serializeMoney(item.unitPrice),
      totalPrice: (Number(item.unitPrice) * item.quantity).toFixed(2),
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        imageUrl: item.product.imageUrl,
        price: serializeMoney(item.product.price),
        stock: item.product.stock,
        status: item.product.status
      }
    })),
    summary: {
      subtotal: subtotal.toFixed(2),
      totalItems: cart.items.reduce((total, item) => total + item.quantity, 0),
      distinctItems: cart.items.length
    }
  };
}

export class CartService {
  async getActiveCart(userId: string) {
    const cartId = await getOrCreateActiveCart(userId);
    return getCartSummary(cartId);
  }

  async addItem(userId: string, input: AddCartItemInput) {
    const cartId = await getOrCreateActiveCart(userId);

    const product = await prisma.product.findUnique({
      where: { id: input.productId },
      select: { id: true, price: true, stock: true, status: true }
    });

    if (!product || product.status !== ProductStatus.ACTIVE) {
      throw new AppError("Product is not available", 404);
    }

    const existing = await prisma.cartItem.findFirst({
      where: { cartId, productId: input.productId },
      select: { id: true, quantity: true }
    });

    const requestedQty = (existing?.quantity ?? 0) + input.quantity;
    if (requestedQty > product.stock) {
      throw new AppError("Requested quantity exceeds stock", 422);
    }

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: requestedQty, unitPrice: product.price }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId,
          productId: input.productId,
          quantity: input.quantity,
          unitPrice: product.price
        }
      });
    }

    return getCartSummary(cartId);
  }

  async updateItem(userId: string, itemId: string, input: UpdateCartItemInput) {
    const cartId = await getOrCreateActiveCart(userId);
    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId },
      include: {
        product: {
          select: {
            stock: true,
            price: true,
            status: true
          }
        }
      }
    });

    if (!item) {
      throw new AppError("Cart item not found", 404);
    }

    if (item.product.status !== ProductStatus.ACTIVE) {
      throw new AppError("Product is no longer available", 422);
    }

    if (input.quantity > item.product.stock) {
      throw new AppError("Requested quantity exceeds stock", 422);
    }

    await prisma.cartItem.update({
      where: { id: item.id },
      data: {
        quantity: input.quantity,
        unitPrice: item.product.price
      }
    });

    return getCartSummary(cartId);
  }

  async removeItem(userId: string, itemId: string) {
    const cartId = await getOrCreateActiveCart(userId);
    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId },
      select: { id: true }
    });

    if (!item) {
      throw new AppError("Cart item not found", 404);
    }

    await prisma.cartItem.delete({ where: { id: item.id } });
    return getCartSummary(cartId);
  }
}

export const cartService = new CartService();
