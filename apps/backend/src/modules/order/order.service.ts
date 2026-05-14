import {
  CartStatus,
  OrderStatus,
  PaymentProvider,
  PaymentMethodType,
  PaymentStatus,
  Prisma,
  ProductStatus,
  UserStatus,
} from "@prisma/client";

import { AppError } from "../../lib/app-error.js";
import { prisma } from "../../lib/prisma.js";
import { createMidtransSnapTransaction } from "./midtrans.service.js";

import type { CreateOrderInput } from "./order.schemas.js";

const guestUserEmail = "guest@katta.local";
const shippingAmount = 20000;

async function getOrCreateGuestUserId() {
  const user = await prisma.user.upsert({
    where: { email: guestUserEmail },
    update: {},
    create: {
      name: "Guest Shopper",
      email: guestUserEmail,
      passwordHash: "guest-no-login",
      status: UserStatus.ACTIVE
    },
    select: { id: true }
  });

  return user.id;
}

async function getActiveCartWithItems(userId: string) {
  const cart = await prisma.cart.findFirst({
    where: {
      userId,
      status: CartStatus.ACTIVE
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty", 422);
  }

  return cart;
}

function toDecimal(value: number): Prisma.Decimal {
  return new Prisma.Decimal(value.toFixed(2));
}

function createOrderNumber() {
  const stamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 900 + 100).toString();
  return `KTA-${stamp}${random}`;
}

export class OrderService {
  async createOrder(input: CreateOrderInput) {
    const userId = await getOrCreateGuestUserId();
    const cart = await getActiveCartWithItems(userId);

    for (const item of cart.items) {
      if (item.product.status !== ProductStatus.ACTIVE) {
        throw new AppError(`Product ${item.product.name} is no longer available`, 422);
      }
      if (item.quantity > item.product.stock) {
        throw new AppError(`Stock is not enough for ${item.product.name}`, 422);
      }
    }

    const subtotal = cart.items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
    const totalAmount = subtotal + shippingAmount;

    const result = await prisma.$transaction(async (tx) => {
      const address = await tx.address.create({
        data: {
          userId,
          label: "Primary Shipping",
          recipientName: input.recipientName,
          phone: input.phone,
          country: "Indonesia",
          province: input.province,
          city: input.city,
          district: input.district,
          postalCode: input.postalCode,
          line1: input.line1,
          line2: input.line2,
          notes: input.notes,
          isDefault: true
        }
      });

      const order = await tx.order.create({
        data: {
          orderNumber: createOrderNumber(),
          userId,
          cartId: cart.id,
          shippingAddressId: address.id,
          status: OrderStatus.AWAITING_PAYMENT,
          subtotalAmount: toDecimal(subtotal),
          shippingAmount: toDecimal(shippingAmount),
          discountAmount: toDecimal(0),
          taxAmount: toDecimal(0),
          totalAmount: toDecimal(totalAmount),
          customerNote: input.customerNote,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              productSku: item.product.sku,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: toDecimal(Number(item.unitPrice) * item.quantity),
              productImage: item.product.imageUrl
            }))
          }
        },
        include: {
          items: true
        }
      });

      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          userId,
          provider: input.paymentProvider,
          methodType:
            input.paymentProvider === PaymentProvider.MIDTRANS
              ? PaymentMethodType.VIRTUAL_ACCOUNT
              : PaymentMethodType.MANUAL,
          status: PaymentStatus.PENDING,
          amount: toDecimal(totalAmount),
          currency: "IDR"
        },
        select: {
          id: true
        }
      });

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          status: CartStatus.CONVERTED
        }
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      await tx.cart.create({
        data: {
          userId,
          status: CartStatus.ACTIVE
        }
      });

      return {
        order,
        paymentId: payment.id,
        user: {
          id: userId,
          name: input.recipientName,
          email: guestUserEmail,
          phone: input.phone
        }
      };
    });

    let payment: {
      provider: PaymentProvider;
      token: string;
      redirectUrl: string;
    } | null = null;

    if (input.paymentProvider === PaymentProvider.MIDTRANS) {
      const snap = await createMidtransSnapTransaction({
        orderNumber: result.order.orderNumber,
        grossAmount: Number(result.order.totalAmount),
        customer: {
          firstName: result.user.name,
          email: result.user.email,
          phone: result.user.phone
        }
      });

      await prisma.payment.update({
        where: { id: result.paymentId },
        data: {
          providerReference: result.order.orderNumber,
          providerPayload: snap.raw as Prisma.JsonObject
        }
      });

      payment = {
        provider: PaymentProvider.MIDTRANS,
        token: snap.token,
        redirectUrl: snap.redirectUrl
      };
    }

    return {
      message: "Order created",
      order: {
        id: result.order.id,
        orderNumber: result.order.orderNumber,
        status: result.order.status,
        subtotalAmount: result.order.subtotalAmount.toString(),
        shippingAmount: result.order.shippingAmount.toString(),
        totalAmount: result.order.totalAmount.toString(),
        itemCount: result.order.items.length
      },
      payment
    };
  }
}

export const orderService = new OrderService();
