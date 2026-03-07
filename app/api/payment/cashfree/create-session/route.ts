import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const CASHFREE_BASE_URL =
  process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

export async function POST(req: NextRequest) {
  try {
    console.log("CLIENT ID EXISTS:", !!process.env.CASHFREE_CLIENT_ID);
console.log("CLIENT SECRET EXISTS:", !!process.env.CASHFREE_CLIENT_SECRET);
console.log("ENV:", process.env.CASHFREE_ENV);
console.log("BASE URL:", CASHFREE_BASE_URL);
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { orderId } = body as { orderId?: string };

    if (!orderId) {
      return NextResponse.json(
        { ok: false, error: "orderId is required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        address: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { ok: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const cashfreeOrderId = order.id;

    const payload = {
      order_id: cashfreeOrderId,
      order_amount: Number(order.total),
      order_currency: "INR",
      customer_details: {
        customer_id: userId,
        customer_name: order.address.fullName,
        customer_email: session.user.email,
        customer_phone: order.address.phoneNumber,
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order_id={order_id}`,
      },
    };

    const response = await fetch(`${CASHFREE_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_CLIENT_ID!,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET!,
        "x-api-version": "2025-01-01",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: data?.message || "Cashfree order creation failed" },
        { status: 400 }
      );
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        cashfreeOrderId: data.order_id,
        paymentSessionId: data.payment_session_id,
      },
    });

    return NextResponse.json({
      ok: true,
      paymentSessionId: data.payment_session_id,
      cashfreeOrderId: data.order_id,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Internal server error" },
      { status: 500 }
    );
  }
}