import { OrderStatus, PaymentStatus, Prisma, ProductStatus, UserRole } from "@prisma/client";

import { AppError } from "../../lib/app-error.js";

import { prisma } from "../../lib/prisma.js";
import type { SalesReportQueryInput } from "./admin.report.schemas.js";

export class AdminService {
  async getOverview() {
    const [
      totalCustomers,
      totalProducts,
      totalOrders,
      pendingOrders,
      paidPayments,
      revenueAggregate,
      monthlyRevenueAggregate,
      recentOrders
    ] = await Promise.all([
      prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
      prisma.product.count({ where: { status: ProductStatus.ACTIVE } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: { in: [OrderStatus.PENDING, OrderStatus.AWAITING_PAYMENT] } } }),
      prisma.payment.count({ where: { status: PaymentStatus.PAID } }),
      prisma.payment.aggregate({
        where: { status: PaymentStatus.PAID },
        _sum: { amount: true }
      }),
      prisma.payment.aggregate({
        where: {
          status: PaymentStatus.PAID,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        _sum: { amount: true }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          totalAmount: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })
    ]);

    return {
      stats: {
        totalCustomers,
        totalProducts,
        totalOrders,
        pendingOrders,
        successfulPayments: paidPayments,
        totalRevenue: revenueAggregate._sum.amount?.toString() ?? "0",
        monthlyRevenue: monthlyRevenueAggregate._sum.amount?.toString() ?? "0"
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount.toString(),
        createdAt: order.createdAt.toISOString(),
        customer: order.user
      }))
    };
  }

  async listOrders() {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            status: true,
            provider: true
          }
        }
      }
    });

    return {
      items: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount.toString(),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        customer: order.user,
        payment: order.payments[0] ?? null
      }))
    };
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const existing = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, status: true }
    });

    if (!existing) {
      throw new AppError("Order not found", 404);
    }

    const now = new Date();
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        shippedAt: status === OrderStatus.SHIPPED ? now : undefined,
        deliveredAt: status === OrderStatus.DELIVERED ? now : undefined,
        cancelledAt: status === OrderStatus.CANCELLED ? now : undefined
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        updatedAt: true
      }
    });

    return {
      message: "Order status updated",
      order: {
        ...updated,
        updatedAt: updated.updatedAt.toISOString()
      }
    };
  }

  async listCustomers() {
    const customers = await prisma.user.findMany({
      where: {
        role: UserRole.CUSTOMER
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        _count: {
          select: {
            orders: true,
            payments: true
          }
        }
      }
    });

    return {
      items: customers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        createdAt: customer.createdAt.toISOString(),
        lastLoginAt: customer.lastLoginAt?.toISOString() ?? null,
        totalOrders: customer._count.orders,
        totalPayments: customer._count.payments
      }))
    };
  }

  async getSalesReport(query: SalesReportQueryInput) {
    if (query.period === "daily") {
      const rows = await prisma.$queryRaw<Array<{ date: Date; total_revenue: Prisma.Decimal; total_orders: bigint }>>`
        SELECT
          DATE(o."createdAt") AS date,
          COALESCE(SUM(o."totalAmount"), 0) AS total_revenue,
          COUNT(o.id) AS total_orders
        FROM "Order" o
        WHERE o.status IN ('PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED')
        GROUP BY DATE(o."createdAt")
        ORDER BY DATE(o."createdAt") DESC
        LIMIT 30
      `;

      return {
        period: "daily",
        items: rows.map((row) => ({
          label: row.date.toISOString().slice(0, 10),
          totalRevenue: row.total_revenue.toString(),
          totalOrders: Number(row.total_orders)
        }))
      };
    }

    const monthlyRows = await prisma.$queryRaw<Array<{ month: Date; total_revenue: Prisma.Decimal; total_orders: bigint }>>`
      SELECT
        DATE_TRUNC('month', o."createdAt") AS month,
        COALESCE(SUM(o."totalAmount"), 0) AS total_revenue,
        COUNT(o.id) AS total_orders
      FROM "Order" o
      WHERE o.status IN ('PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED')
      GROUP BY DATE_TRUNC('month', o."createdAt")
      ORDER BY DATE_TRUNC('month', o."createdAt") DESC
      LIMIT 12
    `;

    return {
      period: "monthly",
      items: monthlyRows.map((row) => ({
        label: `${row.month.getUTCFullYear()}-${String(row.month.getUTCMonth() + 1).padStart(2, "0")}`,
        totalRevenue: row.total_revenue.toString(),
        totalOrders: Number(row.total_orders)
      }))
    };
  }
}

export const adminService = new AdminService();
