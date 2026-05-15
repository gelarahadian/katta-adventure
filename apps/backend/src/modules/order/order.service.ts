import {
  CartStatus,
  OrderStatus,
  PaymentProvider,
  PaymentMethodType,
  PaymentStatus,
  Prisma,
  ProductStatus,
} from "@prisma/client";
import { createHash } from "node:crypto";

import { AppError } from "../../lib/app-error.js";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";
import { createMidtransSnapTransaction } from "./midtrans.service.js";

import type { CreateOrderInput, MidtransWebhookInput } from "./order.schemas.js";
import type { CreateAddressInput, ListAddressesQueryInput } from "./order.schemas.js";

const shippingAmount = 20000;

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

function isMidtransSignatureValid(payload: MidtransWebhookInput) {
  const serverKey = env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    return false;
  }

  const raw = `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`;
  const hash = createHash("sha512").update(raw).digest("hex");
  return hash === payload.signature_key;
}

function mapMidtransStatusToPaymentStatus(payload: MidtransWebhookInput): PaymentStatus {
  if (payload.transaction_status === "settlement") {
    return PaymentStatus.PAID;
  }

  if (payload.transaction_status === "capture") {
    if (payload.fraud_status === "challenge") {
      return PaymentStatus.PENDING;
    }
    return PaymentStatus.PAID;
  }

  if (payload.transaction_status === "pending") {
    return PaymentStatus.PENDING;
  }

  if (payload.transaction_status === "expire") {
    return PaymentStatus.EXPIRED;
  }

  if (payload.transaction_status === "refund" || payload.transaction_status === "partial_refund") {
    return PaymentStatus.REFUNDED;
  }

  if (payload.transaction_status === "cancel" || payload.transaction_status === "deny") {
    return PaymentStatus.CANCELLED;
  }

  return PaymentStatus.FAILED;
}

function mapPaymentToOrderStatus(status: PaymentStatus): OrderStatus {
  if (status === PaymentStatus.PAID) {
    return OrderStatus.PAID;
  }
  if (status === PaymentStatus.EXPIRED || status === PaymentStatus.CANCELLED || status === PaymentStatus.FAILED) {
    return OrderStatus.CANCELLED;
  }
  if (status === PaymentStatus.REFUNDED) {
    return OrderStatus.REFUNDED;
  }
  return OrderStatus.AWAITING_PAYMENT;
}

function mapOrderAndPaymentToResultState(orderStatus: OrderStatus, paymentStatus: PaymentStatus) {
  if (orderStatus === OrderStatus.PAID || paymentStatus === PaymentStatus.PAID) {
    return "success" as const;
  }

  if (
    orderStatus === OrderStatus.CANCELLED ||
    paymentStatus === PaymentStatus.CANCELLED ||
    paymentStatus === PaymentStatus.EXPIRED ||
    paymentStatus === PaymentStatus.FAILED
  ) {
    return "failed" as const;
  }

  if (orderStatus === OrderStatus.REFUNDED || paymentStatus === PaymentStatus.REFUNDED) {
    return "refunded" as const;
  }

  return "pending" as const;
}

export class OrderService {
  async listAddresses(userId: string, query: ListAddressesQueryInput) {
    const addresses = await prisma.address.findMany({
      where: {
        userId,
        ...(query.includeInactive ? {} : { isDefault: true })
      },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        label: true,
        recipientName: true,
        phone: true,
        province: true,
        city: true,
        district: true,
        postalCode: true,
        line1: true,
        line2: true,
        notes: true,
        isDefault: true,
        updatedAt: true
      }
    });

    return {
      items: addresses.map((address) => ({ ...address, updatedAt: address.updatedAt.toISOString() }))
    };
  }

  async createAddress(userId: string, input: CreateAddressInput) {
    const hasAnyAddress =
      (await prisma.address.count({
        where: { userId }
      })) > 0;

    if (!hasAnyAddress) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        label: "Saved Address",
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
        isDefault: !hasAnyAddress
      },
      select: {
        id: true,
        recipientName: true,
        phone: true,
        province: true,
        city: true,
        district: true,
        postalCode: true,
        line1: true,
        line2: true,
        notes: true,
        isDefault: true,
        updatedAt: true
      }
    });

    return {
      message: "Address saved",
      item: {
        ...address,
        updatedAt: address.updatedAt.toISOString()
      }
    };
  }

  async createOrder(userId: string, input: CreateOrderInput) {
    const cart = await getActiveCartWithItems(userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

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

    const selectedAddress = input.addressId
      ? await prisma.address.findFirst({
          where: { id: input.addressId, userId },
          select: { id: true, phone: true }
        })
      : null;

    if (input.addressId && !selectedAddress) {
      throw new AppError("Address not found", 404);
    }

    const result = await prisma.$transaction(async (tx) => {
      const addressId = selectedAddress
        ? selectedAddress.id
        : (
            await tx.address.create({
              data: {
                userId,
                label: "Saved Address",
                recipientName: input.address!.recipientName,
                phone: input.address!.phone,
                country: "Indonesia",
                province: input.address!.province,
                city: input.address!.city,
                district: input.address!.district,
                postalCode: input.address!.postalCode,
                line1: input.address!.line1,
                line2: input.address!.line2,
                notes: input.address!.notes,
                isDefault: false
              },
              select: { id: true }
            })
          ).id;

      const order = await tx.order.create({
        data: {
          orderNumber: createOrderNumber(),
          userId,
          cartId: cart.id,
          shippingAddressId: addressId,
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
          name: user.name,
          email: user.email,
          phone: selectedAddress?.phone ?? input.address?.phone ?? ""
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

  async handleMidtransWebhook(payload: MidtransWebhookInput) {
    if (!isMidtransSignatureValid(payload)) {
      throw new AppError("Invalid Midtrans signature", 401);
    }

    const payment = await prisma.payment.findFirst({
      where: {
        provider: PaymentProvider.MIDTRANS,
        OR: [{ providerReference: payload.order_id }, { order: { orderNumber: payload.order_id } }]
      },
      include: {
        order: {
          select: {
            id: true,
            status: true
          }
        }
      }
    });

    if (!payment) {
      throw new AppError("Payment not found for Midtrans order", 404);
    }

    const nextPaymentStatus = mapMidtransStatusToPaymentStatus(payload);
    const nextOrderStatus = mapPaymentToOrderStatus(nextPaymentStatus);

    if (payment.status === nextPaymentStatus && payment.order.status === nextOrderStatus) {
      return {
        message: "Webhook already processed",
        payment: {
          id: payment.id,
          status: payment.status
        },
        order: {
          id: payment.order.id,
          status: payment.order.status
        }
      };
    }

    const updatedPayment = await prisma.payment.update({
      where: {
        id: payment.id
      },
      data: {
        status: nextPaymentStatus,
        methodType: payload.payment_type ? PaymentMethodType.BANK_TRANSFER : payment.methodType,
        paidAt: nextPaymentStatus === PaymentStatus.PAID ? new Date() : payment.paidAt,
        providerReference: payload.order_id,
        providerPayload: payload as unknown as Prisma.JsonObject
      }
    });

    await prisma.order.update({
      where: {
        id: payment.order.id
      },
      data: {
        status: nextOrderStatus,
        paidAt: nextPaymentStatus === PaymentStatus.PAID ? new Date() : undefined,
        cancelledAt:
          nextOrderStatus === OrderStatus.CANCELLED && payment.order.status !== OrderStatus.CANCELLED
            ? new Date()
            : undefined
      }
    });

    return {
      message: "Webhook processed",
      payment: {
        id: updatedPayment.id,
        status: updatedPayment.status
      },
      order: {
        id: payment.order.id,
        status: nextOrderStatus
      }
    };
  }

  async getOrderPaymentStatus(userId: string, orderNumber: string) {
    const order = await prisma.order.findFirst({
      where: {
        orderNumber,
        userId
      },
      include: {
        payments: {
          orderBy: {
            createdAt: "desc"
          },
          take: 1
        }
      }
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const latestPayment = order.payments[0];
    if (!latestPayment) {
      throw new AppError("Payment record not found", 404);
    }

    return {
      orderNumber: order.orderNumber,
      orderStatus: order.status,
      paymentStatus: latestPayment.status,
      totalAmount: order.totalAmount.toString(),
      updatedAt: order.updatedAt.toISOString(),
      state: mapOrderAndPaymentToResultState(order.status, latestPayment.status)
    };
  }

  async listOrders(userId: string) {
    const orders = await prisma.order.findMany({
      where: {
        userId
      },
      include: {
        payments: {
          orderBy: {
            createdAt: "desc"
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return {
      items: orders.map((order) => {
        const payment = order.payments[0];
        return {
          id: order.id,
          orderNumber: order.orderNumber,
          orderStatus: order.status,
          paymentStatus: payment?.status ?? null,
          totalAmount: order.totalAmount.toString(),
          createdAt: order.createdAt.toISOString(),
          updatedAt: order.updatedAt.toISOString(),
          state: payment
            ? mapOrderAndPaymentToResultState(order.status, payment.status)
            : mapOrderAndPaymentToResultState(order.status, PaymentStatus.PENDING)
        };
      })
    };
  }

  async getOrderDetail(userId: string, orderNumber: string) {
    const order = await prisma.order.findFirst({
      where: {
        orderNumber,
        userId
      },
      include: {
        items: true,
        payments: {
          orderBy: {
            createdAt: "desc"
          },
          take: 1
        },
        shippingAddress: true
      }
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const payment = order.payments[0];

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      orderStatus: order.status,
      paymentStatus: payment?.status ?? null,
      subtotalAmount: order.subtotalAmount.toString(),
      shippingAmount: order.shippingAmount.toString(),
      totalAmount: order.totalAmount.toString(),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      state: payment
        ? mapOrderAndPaymentToResultState(order.status, payment.status)
        : mapOrderAndPaymentToResultState(order.status, PaymentStatus.PENDING),
      shippingAddress: {
        recipientName: order.shippingAddress.recipientName,
        phone: order.shippingAddress.phone,
        province: order.shippingAddress.province,
        city: order.shippingAddress.city,
        district: order.shippingAddress.district,
        postalCode: order.shippingAddress.postalCode,
        line1: order.shippingAddress.line1,
        line2: order.shippingAddress.line2
      },
      items: order.items.map((item) => ({
        id: item.id,
        productName: item.productName,
        productSku: item.productSku,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        totalPrice: item.totalPrice.toString(),
        productImage: item.productImage
      }))
    };
  }
}

export const orderService = new OrderService();
