import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const body = await req.json();

    const {
      name,
      slug,
      prodImage,
      price,
      categoryId,
      isPublished,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Product name is required" },
        { status: 400 }
      );
    }

    if (!slug?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Slug is required" },
        { status: 400 }
      );
    }

    if (!prodImage?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Product image is required" },
        { status: 400 }
      );
    }

    if (!categoryId?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Category is required" },
        { status: 400 }
      );
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return NextResponse.json(
        { ok: false, error: "Price must be a valid positive number" },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { ok: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const slugOwner = await prisma.product.findUnique({
      where: { slug: slug.trim() },
    });

    if (slugOwner && slugOwner.id !== productId) {
      return NextResponse.json(
        { ok: false, error: "Slug already exists" },
        { status: 409 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name.trim(),
        slug: slug.trim(),
        prodImage: prodImage.trim(),
        price: numericPrice,
        categoryId: categoryId.trim(),
        isPublished: Boolean(isPublished),
      },
    });

    return NextResponse.json({
      ok: true,
      msg: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("PATCH PRODUCT ERROR:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { ok: false, error: "Product not found" },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({
      ok: true,
      msg: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}