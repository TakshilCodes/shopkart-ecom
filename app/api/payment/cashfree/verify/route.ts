import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const CASHFREE_BASE_URL =
  process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { ok: false, error: "orderId is required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        { ok: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const response = await fetch(`${CASHFREE_BASE_URL}/orders/${order.id}`, {
      method: "GET",
      headers: {
        "x-client-id": process.env.CASHFREE_CLIENT_ID!,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET!,
        "x-api-version": "2025-01-01",
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: data?.message || "Failed to verify payment" },
        { status: 400 }
      );
    }
    
    const isPaid =
      data.order_status === "PAID" ||
      data.order_status === "SUCCESS";

    if (!isPaid) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "FAILED",
        },
      });

      return NextResponse.json({
        ok: false,
        error: "Payment not completed",
      });
    }

    if (order.status !== "PAID") {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: "PAID",
          },
        });

        for (const item of order.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });
        }

        await tx.cart.deleteMany({
          where: {
            userId: order.userId,
          },
        })
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Payment verified",
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Internal server error" },
      { status: 500 }
    );
  }
}