import { OrderStatus, PaymentStatus, ProductStatus, UserRole } from "@prisma/client";

import { prisma } from "../../lib/prisma.js";

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
}

export const adminService = new AdminService();
