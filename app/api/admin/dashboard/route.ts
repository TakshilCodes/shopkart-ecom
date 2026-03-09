import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [ totalOrders, totalProducts, totalUsers, revenueResult, pendingOrders, outOfStockProducts, recentOrders, recentProducts,lowStockProducts,] = await Promise.all([
      prisma.order.count(),

      prisma.product.count(),

      prisma.users.count(),

      prisma.order.aggregate({
        where: {
          status: "PAID",
        },
        _sum: {
          total: true,
        },
      }),

      prisma.order.count({
        where: {
          status: "PENDING_PAYMENT",
        },
      }),

      prisma.product.count({
        where: {
          productvariant: {
            every: {
              stockQuantity: 0,
            },
          },
        },
      }),

      prisma.order.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          total: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              DisplayName: true,
              email: true,
            },
          },
          items: {
            select: {
              quantity: true,
            },
          },
        },
      }),

      prisma.product.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          prodImage: true,
          name: true,
          category: {
            select: {
              name: true,
            },
          },
          price: true,
          isPublished: true,
        },
      }),

      prisma.product.findMany({
        where: {
          productvariant: {
            some: {
              stockQuantity: {
                lte: 5,
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          name: true,
          prodImage: true,
          category: {
            select: {
              name: true,
            },
          },
          productvariant: {
            where: {
              stockQuantity: {
                lte: 5,
              },
            },
            select: {
              size: true,
              stockQuantity: true,
            },
          },
        },
      }),
    ]);

    const formattedRecentOrders = recentOrders.map((order) => ({
      id: order.id,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      customerName: order.user.DisplayName,
      customerEmail: order.user.email,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    }));

    return NextResponse.json(
      {
        ok: true,
        stats: {
          totalOrders,
          totalProducts,
          totalUsers,
          totalRevenue: revenueResult._sum.total ?? 0,
          pendingOrders,
          outOfStockProducts,
        },
        recentOrders: formattedRecentOrders,
        recentProducts,
        lowStockProducts,
        error: null,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        stats: null,
        recentOrders: null,
        recentProducts: null,
        lowStockProducts: null,
        error: e?.message ?? "Something went wrong",
      },
      { status: 500 }
    );
  }
}