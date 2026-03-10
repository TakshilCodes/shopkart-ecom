import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, size, stockQuantity } = body;

    if (!productId || !size || stockQuantity === undefined) {
      return NextResponse.json(
        { ok: false, error: "productId, size and stockQuantity are required" },
        { status: 400 }
      );
    }

    const cleanSize = String(size).trim().toUpperCase();
    const cleanStock = Number(stockQuantity);

    if (!cleanSize) {
      return NextResponse.json(
        { ok: false, error: "Size is required" },
        { status: 400 }
      );
    }

    if (Number.isNaN(cleanStock) || cleanStock < 0) {
      return NextResponse.json(
        { ok: false, error: "Stock quantity must be 0 or more" },
        { status: 400 }
      );
    }

    const existing = await prisma.productVariant.findUnique({
      where: {
        productId_size: {
          productId,
          size: cleanSize,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, error: "This size already exists for the product" },
        { status: 409 }
      );
    }

    const variant = await prisma.productVariant.create({
      data: {
        productId,
        size: cleanSize,
        stockQuantity: cleanStock,
      },
    });

    return NextResponse.json(
      { ok: true, msg: "Size added successfully", variant },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST VARIANT ERROR:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to add size" },
      { status: 500 }
    );
  }
}