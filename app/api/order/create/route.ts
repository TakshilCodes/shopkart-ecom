import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please sign in before checkout",
          msg: null,
        },
        { status: 401 }
      );
    }

    const addressId = req.nextUrl.searchParams.get("addressId");

    if (!addressId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Address id is required",
          msg: null,
        },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        cart: {
          select: {
            id: true,
            quantity: true,
            productvariant: {
              select: {
                id: true,
                product: {
                  select: {
                    id: true,
                    price: true,
                    isPublished: true,
                  },
                },
              },
            },
          },
        },
        address: {
          where: {
            id: addressId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error: "User not found",
          msg: null,
        },
        { status: 404 }
      );
    }

    if (user.cart.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Your cart is empty",
          msg: null,
        },
        { status: 400 }
      );
    }

    if (user.address.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid address selected",
          msg: null,
        },
        { status: 400 }
      );
    }

    const subtotal = user.cart.reduce((sum, item) => {
      return sum + item.productvariant.product.price.toNumber() * item.quantity;
    }, 0);

    const shipping = 0;
    const total = subtotal + shipping;

    const order = await prisma.order.create({
      data: {
        userId,
        addressId,
        subtotal,
        shipping,
        total,
      },
    });

    await prisma.orderItem.createMany({
      data: user.cart.map((item) => ({
        orderId: order.id,
        productId: item.productvariant.product.id,
        variantId: item.productvariant.id,
        quantity: item.quantity,
        priceAtPurchase: item.productvariant.product.price,
      })),
    });

    return NextResponse.json(
      {
        ok: true,
        error: null,
        msg: "Order created successfully",
        orderId: order.id,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: e?.message,
        msg: null,
      },
      { status: 500 }
    );
  }
}