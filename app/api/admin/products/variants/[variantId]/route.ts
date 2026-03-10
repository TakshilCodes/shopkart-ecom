import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ variantId: string }> }
) {
  try {
    const { variantId } = await params;
    const body = await req.json();
    const { size, stockQuantity } = body;

    const existingVariant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!existingVariant) {
      return NextResponse.json(
        { ok: false, error: "Variant not found" },
        { status: 404 }
      );
    }

    const data: { size?: string; stockQuantity?: number } = {};

    if (size !== undefined) {
      const cleanSize = String(size).trim().toUpperCase();

      if (!cleanSize) {
        return NextResponse.json(
          { ok: false, error: "Size cannot be empty" },
          { status: 400 }
        );
      }

      const duplicate = await prisma.productVariant.findFirst({
        where: {
          productId: existingVariant.productId,
          size: cleanSize,
          NOT: { id: variantId },
        },
      });

      if (duplicate) {
        return NextResponse.json(
          { ok: false, error: "This size already exists for the product" },
          { status: 409 }
        );
      }

      data.size = cleanSize;
    }

    if (stockQuantity !== undefined) {
      const cleanStock = Number(stockQuantity);

      if (Number.isNaN(cleanStock) || cleanStock < 0) {
        return NextResponse.json(
          { ok: false, error: "Stock quantity must be 0 or more" },
          { status: 400 }
        );
      }

      data.stockQuantity = cleanStock;
    }

    const updated = await prisma.productVariant.update({
      where: { id: variantId },
      data,
    });

    return NextResponse.json({
      ok: true,
      msg: "Variant updated successfully",
      variant: updated,
    });
  } catch (error) {
    console.error("PATCH VARIANT ERROR:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update variant" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ variantId: string }> }
) {
  try {
    const { variantId } = await params;

    const existingVariant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        cart: true,
      },
    });

    if (!existingVariant) {
      return NextResponse.json(
        { ok: false, error: "Variant not found" },
        { status: 404 }
      );
    }

    await prisma.productVariant.delete({
      where: { id: variantId },
    });

    return NextResponse.json({
      ok: true,
      msg: "Variant deleted successfully",
    });
  } catch (error) {
    console.error("DELETE VARIANT ERROR:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete variant" },
      { status: 500 }
    );
  }
}