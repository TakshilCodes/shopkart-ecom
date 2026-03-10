import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
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

    const existingSlug = await prisma.product.findUnique({
      where: { slug: slug.trim() },
    });

    if (existingSlug) {
      return NextResponse.json(
        { ok: false, error: "Slug already exists" },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        prodImage: prodImage.trim(),
        price: numericPrice,
        categoryId: categoryId.trim(),
        isPublished: Boolean(isPublished),
      },
    });

    return NextResponse.json(
      {
        ok: true,
        msg: "Product created successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}